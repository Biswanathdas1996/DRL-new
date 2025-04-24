import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { barChartData, barChartDataTemplate } from "./MockData"; // Adjust the import path as necessary

import {
  extractJavascriptCode,
  generatePromptForChart,
} from "../../helper/common";

interface MyNivoLineChartProps {
  data: any;
  callGpt: any;
}

const MyResponsiveBar = ({ data, callGpt }: MyNivoLineChartProps) => {
  const [barCjhartData, setBarChartData] = React.useState<any>([]);

  const loadData = async () => {
    const query = generatePromptForChart(
      data,
      barChartDataTemplate,
      "Bar chart",
      "@nivo/bar"
    );

    callGpt(query).then((response: string | null) => {
      if (response) {
        const code: string | null = extractJavascriptCode(response);

        if (code !== null) {
          try {
            try {
              const executeFunction: (data: any) => any = eval(`(${code})`);
              if (typeof executeFunction === "function") {
                const filteredData: any = executeFunction(data);
                console.log("Filtered Data:", filteredData);
                setBarChartData(filteredData);
              } else {
                console.error("Generated code is not a valid function.");
              }
            } catch (error: unknown) {
              console.error("Error evaluating the generated code:", error);
            }
          } catch (error: unknown) {
            console.error("Error executing the generated code:", error);
          }
        } else {
          console.error("Failed to extract JavaScript code from the response.");
        }
      }
    });
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <button onClick={loadData} style={{ marginBottom: "10px" }}>
        Load Bar Data
      </button>
      {barCjhartData.length > 0 && (
        <ResponsiveBar
          data={barCjhartData}
          keys={Object.keys(barCjhartData[0]).filter(
            (key) => key !== "country" && typeof key === "string"
          )}
          indexBy="country"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "nivo" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: {
                id: "fries",
              },
              id: "dots",
            },
            {
              match: {
                id: "sandwich",
              },
              id: "lines",
            },
          ]}
          borderColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "country",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "food",
            legendPosition: "middle",
            legendOffset: -40,
            truncateTickAt: 0,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1.6]],
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={(e) =>
            e.id + ": " + e.formattedValue + " in country: " + e.indexValue
          }
        />
      )}
    </div>
  );
};

export default MyResponsiveBar;
