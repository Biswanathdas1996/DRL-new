import React from "react";
import { ResponsiveRadialBar } from "@nivo/radial-bar";
import {
  extractJavascriptCode,
  generatePromptForChart,
} from "../../helper/common";
import { pieChartData, pieChartDataTemplate } from "./MockData"; // Adjust the import path as necessary
interface MyNivoPieChartProps {
  data: any;
  callGpt: any;
}
const MyResponsiveRadialBar = ({ data, callGpt }: MyNivoPieChartProps) => {
  const [pieCjhartData, setPieChartData] = React.useState<any>(null);

  const loadData = async () => {
    const query = generatePromptForChart(
      data,
      pieChartDataTemplate,
      "Radial-bar chart",
      "@nivo/radial-bar"
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
                setPieChartData(filteredData);
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
        Load Pie Data
      </button>
      {pieCjhartData && (
        <ResponsiveRadialBar
          data={pieCjhartData}
          valueFormat=">-.2f"
          padding={0.4}
          cornerRadius={2}
          margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
          radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
          circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
          legends={[
            {
              anchor: "right",
              direction: "column",
              justify: false,
              translateX: 80,
              translateY: 0,
              itemsSpacing: 6,
              itemDirection: "left-to-right",
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              symbolSize: 18,
              symbolShape: "square",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
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

export default MyResponsiveRadialBar;
