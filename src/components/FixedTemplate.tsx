import React from "react";

type SectionResult = Record<string, string>;
type Section = {
  name: string;
  query: string;
  result: any;
};

type FixedTemplateProps = {
  chat: {
    id: number;
    message: {
      query: string;
      result: Section[];
      summery: string;
      type: string;
    };
    time: string;
    type: string;
  };
};

const getTableHeaders = (results: SectionResult[]) => {
  if (!results.length) return [];
  return Object.keys(results[0]);
};

const FixedTemplate: React.FC<FixedTemplateProps> = ({ chat }) => {
  console.log("sections", chat);

  const sections = chat?.message?.result || [];
  return (
    <div>
      {sections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: 32 }}>
          <h3>{section.name}</h3>
          {section.result && section.result.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    {getTableHeaders(section.result ?? []).map((header) => (
                      <th
                        key={header}
                        style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          background: "#f5f5f5",
                          textTransform: "capitalize",
                        }}
                      >
                        {header.replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.result.map((row: SectionResult, rowIdx: number) => (
                    <tr key={rowIdx}>
                      {getTableHeaders(
                        (section.result as SectionResult[]) ?? []
                      ).map((header: string) => (
                        <td
                          key={header}
                          style={{
                            border: "1px solid #ccc",
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ color: "#888", fontStyle: "italic" }}>
              No data available
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FixedTemplate;
