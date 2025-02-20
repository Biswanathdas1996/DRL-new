import React from "react";
import { data as rawData } from "./data";
import DateComp from "./DateComp";
import dayjs, { Dayjs } from "dayjs";

interface Subsection {
  title: string;
  query: string;
}

const AgentsPage: React.FC = () => {
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
