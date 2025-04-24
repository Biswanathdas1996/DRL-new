import React, { useEffect } from "react";
import { ResponsiveLine } from "@nivo/line";
import { lineChartData, lineChartDataTemplate } from "./MockData";
import {
  extractJavascriptCode,
  generatePromptForChart,
} from "../../helper/common";

interface MyNivoLineChartProps {
  data: any;
  callGpt: any;
}

const MyNivoLineChart = ({ data, callGpt }: MyNivoLineChartProps) => {
  const [lineCjhartData, setLineChartData] = React.useState<any>(null);

  const loadData = async () => {
    const query = generatePromptForChart(
      data,
      lineChartDataTemplate,
      "Line chart",
      "@nivo/line"
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
    <div style={{ height: 400 }}>
      <button onClick={loadData} style={{ marginBottom: "10px" }}>
        Load Line Data
      </button>
      {lineCjhartData && (
        <ResponsiveLine
          data={lineCjhartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "transportation",
            legendOffset: 36,
            legendPosition: "middle",
            truncateTickAt: 0,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "count",
            legendOffset: -40,
            legendPosition: "middle",
            truncateTickAt: 0,
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabel="data.yFormatted"
          pointLabelYOffset={-12}
          enableTouchCrosshair={true}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
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

export default MyNivoLineChart;
