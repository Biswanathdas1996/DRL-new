import React from "react";
import { ResponsiveStream } from "@nivo/stream";
import { radarChartData, radarChartDataTemplate } from "./MockData"; // Adjust the import path as necessary
import {
  extractJavascriptCode,
  generatePromptForChart,
} from "../../helper/common";

interface MyNivoLineChartProps {
  data: any;
  callGpt: any;
}

const MyResponsiveStream = ({ data, callGpt }: MyNivoLineChartProps) => {
  const [lineCjhartData, setLineChartData] = React.useState<any>(null);

  const loadData = async () => {
    const query = generatePromptForChart(
      data,
      radarChartDataTemplate,
      "stream chart",
      "@nivo/stream"
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
                setLineChartData(filteredData);
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
        Load Line Data
      </button>
      {lineCjhartData && (
        <ResponsiveStream
          data={lineCjhartData}
          keys={Object.keys(lineCjhartData[0] || {})} // Dynamically set keys
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendOffset: 36,
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "",
            legendOffset: -40,
            truncateTickAt: 0,
          }}
          enableGridX={true}
          enableGridY={false}
          offsetType="silhouette"
          colors={{ scheme: "nivo" }}
          fillOpacity={0.85}
          borderColor={{ theme: "background" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#2c998f",
              size: 4,
              padding: 2,
              stagger: true,
            },
            {
              id: "squares",
              type: "patternSquares",
              background: "inherit",
              color: "#e4c912",
              size: 6,
              padding: 2,
              stagger: true,
            },
          ]}
          fill={[
            {
              match: {
                id: "Paul",
              },
              id: "dots",
            },
            {
              match: {
                id: "Marcel",
              },
              id: "squares",
            },
          ]}
          dotSize={8}
          dotColor={{ from: "color" }}
          dotBorderWidth={2}
          dotBorderColor={{
            from: "color",
            modifiers: [["darker", 0.7]],
          }}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              translateX: 100,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: "#999999",
              symbolSize: 12,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000000",
                  },
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
};

export default MyResponsiveStream;
