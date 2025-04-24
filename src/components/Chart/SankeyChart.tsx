import React from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { snakeyChartData, snakeyChartDataTemplate } from "./MockData"; // Adjust the import path as necessary
import {
  extractJavascriptCode,
  generatePromptForChart,
} from "../../helper/common";

interface MyNivoLineChartProps {
  data: any;
  callGpt: any;
}

const MyResponsiveSankey = ({ data, callGpt }: MyNivoLineChartProps) => {
  const [lineCjhartData, setLineChartData] = React.useState<any>(null);

  const loadData = async () => {
    const query = generatePromptForChart(
      data,
      snakeyChartDataTemplate,
      "sankey chart",
      "@nivo/sankey"
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
        Load sankey Data
      </button>
      {lineCjhartData && (
        <ResponsiveSankey
          data={lineCjhartData}
          margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
          align="justify"
          colors={{ scheme: "category10" }}
          nodeOpacity={1}
          nodeHoverOthersOpacity={0.35}
          nodeThickness={18}
          nodeSpacing={24}
          nodeBorderWidth={0}
          nodeBorderColor={{
            from: "color",
            modifiers: [["darker", 0.8]],
          }}
          nodeBorderRadius={3}
          linkOpacity={0.5}
          linkHoverOthersOpacity={0.1}
          linkContract={3}
          enableLinkGradient={true}
          labelPosition="outside"
          labelOrientation="vertical"
          labelPadding={16}
          labelTextColor={{
            from: "color",
            modifiers: [["darker", 1]],
          }}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              translateX: 130,
              itemWidth: 100,
              itemHeight: 14,
              itemDirection: "right-to-left",
              itemsSpacing: 2,
              itemTextColor: "#999",
              symbolSize: 14,
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

export default MyResponsiveSankey;
