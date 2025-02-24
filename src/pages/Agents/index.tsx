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
import Loader from "../../components/Loader";
import AgentTable from "./AgentTable";

interface Subsection {
  title: string;
  query: string;
  result?: any;
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
  const [loading, setLoading] = React.useState(false);
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
    setLoading(true);
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
    setData(updatedData);
    localStorage.setItem("agentsData", JSON.stringify(updatedData));
    setLoading(false);
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
    result?: any;
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

  React.useEffect(() => {
    const storedData = localStorage.getItem("agentsData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

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
        {loading ? (
          <Loader showIcon={false} text="Generating Dashboard" />
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={fetchDataAndUpdate}
            id="temp_button"
          >
            GENERATE DASHBOARD
          </Button>
        )}

        <Button
          variant="outlined"
          color="primary"
          style={{ marginLeft: 10 }}
          id="temp_button"
          onClick={() => fetchAllPrompts()}
        >
          Generate Report
        </Button>
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
                            <AgentTable data={subsection.result} />
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
