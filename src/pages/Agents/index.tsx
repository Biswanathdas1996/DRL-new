import React from "react";
import { data as rawData } from "./data";
import DateComp from "./DateComp";
import dayjs, { Dayjs } from "dayjs";
import { EXICUTE_QUERY } from "../../config";
import { useFetch } from "../../hook/useFetch";
import { Button } from "@mui/material";

interface Subsection {
  title: string;
  query: string;
}

const AgentsPage: React.FC = () => {
  const fetchData = useFetch();
  const [data, setData] = React.useState<any[]>([]);

  const [sdate, setSdate] = React.useState<Dayjs | null>(dayjs());
  const [edate, setEdate] = React.useState<Dayjs | null>(dayjs());

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
        subsections.push({ ...subsection, result });
        setData((prevData) => {
          const newData = [...prevData];
          newData[rawData.indexOf(section)].subsections[subsectionIndex] = {
            ...subsection,
            result,
          };
          return newData;
        });
      }
      updatedData.push({ ...section, subsections });
    }
  };

  console.log("data=====>", data);

  return (
    <div>
      <h1>SQL Queries Optimized for PostgreSQL Compatibility</h1>
      <div>
        <DateComp
          sdate={sdate}
          setSdate={setSdate}
          edate={edate}
          setEdate={setEdate}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchDataAndUpdate}
        >
          Submit
        </Button>
      </div>
      {data &&
        data?.map((section, sectionIndex) => (
          <section key={sectionIndex}>
            <h2>{section.title}</h2>
            {section.subsections.map(
              (subsection: Subsection, subsectionIndex: number) => (
                <div key={subsectionIndex}>
                  <h3>{subsection.title}</h3>
                  <pre>{subsection.query}</pre>
                </div>
              )
            )}
          </section>
        ))}

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
