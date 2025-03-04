import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";

const ReportFetcher: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDataAndExport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dateInput = (
        document.getElementById("report-date") as HTMLInputElement
      ).value;
      const dateParts = dateInput.split("-");
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

      const response = await fetch(
        `http://127.0.0.1:5000/report?limit=200000000&offset=0&dates=['${formattedDate}']`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      // 1. Export JSON data to a file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      const jsonUrl = URL.createObjectURL(blob);
      link.href = jsonUrl;
      link.download = "report.json";
      link.click();

      // 2. Convert data to CSV
      if (Array.isArray(data) && data.length > 0) {
        const headers = Object.keys(data[0]);
        const csvRows = [
          headers.join(","), // header row
          ...data.map((row: any) =>
            headers
              .map((header) => {
                // Handle potential null values or formatting issues
                let value =
                  row[header] === null || row[header] === undefined
                    ? ""
                    : row[header].toString();
                // Escape double quotes by doubling them
                value = value.replace(/"/g, '""');
                // Wrap the value in double quotes if it contains commas, double quotes, or newlines
                if (
                  value.includes(",") ||
                  value.includes('"') ||
                  value.includes("\n")
                ) {
                  value = `"${value}"`;
                }
                return value;
              })
              .join(",")
          ), // data rows
        ];
        const csvData = csvRows.join("\n");

        const csvBlob = new Blob([csvData], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);
        link.href = csvUrl;
        link.download = "report.csv";
        link.click();
      } else {
        throw new Error("Data format is not an array of objects.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "inline-flex", float: "right" }}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TextField
            id="report-date"
            label="Report Date"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            id="temp_button"
            color="primary"
            onClick={fetchDataAndExport}
            disabled={isLoading}
          >
            EXPORT to CSV
          </Button>
        </>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ReportFetcher;
