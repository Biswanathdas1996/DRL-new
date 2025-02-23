import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Button,
} from "@mui/material";

interface DynamicTableProps {
  data: any[];
}

const DynamicTable: React.FC<any> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>(data);

  useEffect(() => {
    setFilteredData(
      data.filter((row: Record<string, any>) =>
        searchTerms.every((term: string) =>
          Object.values(row).some(
            (value: any) =>
              typeof value === "string" && value.toLowerCase().includes(term)
          )
        )
      )
    );
  }, [data, searchTerms]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const terms = event.target.value
      .toLowerCase()
      .split(",")
      .map((term) => term.trim());
    setSearchTerms(terms);
  };

  const handleSort = (column: string) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[column] < b[column]) return isAsc ? -1 : 1;
      if (a[column] > b[column]) return isAsc ? 1 : -1;
      return 0;
    });
    setFilteredData(sortedData);
  };

  const handleExport = () => {
    const csvContent: string =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(data[0]).join(","),
        ...data.map((row: Record<string, any>) => Object.values(row).join(",")),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const csvName = prompt("Enter the CSV file name:", "table_data.csv");
    if (csvName) {
      link.setAttribute("download", `${csvName}.csv`);
    } else {
      return;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={handleSearch}
          sx={{ marginBottom: 2 }}
        />

        <button
          className="newConversationButton"
          onClick={handleExport}
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
      {filteredData.length > 0 ? (
        <TableContainer sx={{ width: "100%" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={isNaN(Number(data[0][column])) ? "left" : "right"}
                    sortDirection={orderBy === column ? order : false}
                    style={{
                      whiteSpace: "nowrap",
                      background: "#4b2a91",
                      color: "white",
                      padding: "5px",
                      borderRight: "2px solid #ffffff",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === column}
                      direction={orderBy === column ? order : "asc"}
                      onClick={() => handleSort(column)}
                    >
                      {column
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    style={{
                      backgroundColor:
                        rowIndex % 2 === 0 ? "#a8a8a866" : "#f1f1f1",
                    }}
                  >
                    {columns.map((column, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        align={isNaN(Number(row[column])) ? "left" : "right"}
                        style={{
                          borderRight: "2px solid #ffffff",
                          padding: 5,
                        }}
                      >
                        {row[column]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              {filteredData.length > rowsPerPage && (
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    colSpan={3}
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                      setPage(0);
                      setRowsPerPage(parseInt(event.target.value, 10));
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
  );
};

export default DynamicTable;
