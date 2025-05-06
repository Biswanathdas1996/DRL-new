// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/sankey
import React, { useEffect, useState } from "react";
import { ResponsiveSankey } from "@nivo/sankey";
import { DATA_PROCESSING } from "../../config";
import { useFetch } from "../../hook/useFetch";
import Grid from "@mui/material/Grid2";

type MyResponsiveSankeyProps = {
  data: any;
  chartId?: number;
};

const MyResponsiveSankey = ({ data, chartId }: MyResponsiveSankeyProps) => {
  const [loadingUi, setLoadingUi] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const fetchData = useFetch();

  const handleSubmit = () => {
    setLoadingUi(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      data: data,
      sample_output_template: {
        nodes: [
          {
            id: "<NodeID1>",
            nodeColor: "<Color1>",
          },
          {
            id: "<NodeID2>",
            nodeColor: "<Color2>",
          },
        ],
        links: [
          {
            source: "<SourceNodeID1>",
            target: "<TargetNodeID1>",
            value: "<Value1>",
          },
          {
            source: "<SourceNodeID2>",
            target: "<TargetNodeID2>",
            value: "<Value2>",
          },
        ],
        analytics: "<Analytics and key insides of the data in texts>",
        keyPoints: ["<keyPoint1>", "<keyPoint2>", "<keyPoint3>", "<keyPoint4>"],
        keyKpi: "<Key Performance Indicator>",
        redFlags: ["<RedFlag1>", "<RedFlag2>", "<and so on>"],
        howToReadTheChart:
          "<How to read the chart in texts note: this data will be used to generate the @nivo/sankey chart>",
      },
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetchData(DATA_PROCESSING, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setResponseData(result);
        if (result) {
          try {
            const storedChartData = localStorage.getItem("chartData");
            let chartDataArr = [];
            if (storedChartData) {
              chartDataArr = JSON.parse(storedChartData);
              if (Array.isArray(chartDataArr) && chartDataArr.length > 0) {
                chartDataArr.push({
                  ...result,
                  chartType: "snaky",
                  chartId: Date.now(),
                });
              } else {
                // If not array, convert to array
                chartDataArr = [
                  { ...result, chartType: "snaky", chartId: Date.now() },
                ];
              }
            } else {
              chartDataArr = [
                { ...result, chartType: "snaky", chartId: Date.now() },
              ];
            }
            localStorage.setItem("chartData", JSON.stringify(chartDataArr));
          } catch (e) {
            console.error("Failed to save snaky chart data to localStorage", e);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingUi(false);
      });
  };
  useEffect(() => {
    const storedData = localStorage.getItem("chartData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // If chartData is an array, find the snaky chart data
        const snakyChartData = Array.isArray(parsedData)
          ? parsedData.find(
              (item: any) =>
                item.chartType === "snaky" && item.chartId === chartId
            )
          : parsedData;
        setResponseData(snakyChartData);
      } catch (e) {
        console.error("Failed to parse snaky chart data from localStorage", e);
        handleSubmit();
      }
    } else {
      handleSubmit();
    }
  }, []);

  // Check for circular links in responseData before rendering the chart
  const hasCircularLinks = (data: any) => {
    if (!data?.links || !data?.nodes) return false;
    const graph: Record<string, string[]> = {};
    data.nodes.forEach((node: any) => {
      graph[node.id] = [];
    });
    data.links.forEach((link: any) => {
      graph[link.source]?.push(link.target);
    });

    // DFS to detect cycles
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (node: string): boolean => {
      if (!visited.has(node)) {
        visited.add(node);
        recStack.add(node);
        for (const neighbor of graph[node] || []) {
          if (!visited.has(neighbor) && dfs(neighbor)) return true;
          else if (recStack.has(neighbor)) return true;
        }
      }
      recStack.delete(node);
      return false;
    };

    return Object.keys(graph).some(dfs);
  };

  // Prevent rendering the chart if there are circular links
  if (responseData && hasCircularLinks(responseData)) {
    return null;
  }
  return (
    <>
      <Grid size={6}>
        <div style={{ height: 500 }}>
          {responseData && (
            <ResponsiveSankey
              data={responseData}
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
        {responseData?.howToReadTheChart && (
          <div style={{ fontSize: 13 }}>{responseData?.howToReadTheChart}</div>
        )}
        {loadingUi && <div>Loading...</div>}
      </Grid>
      <Grid size={6}>
        {responseData && (
          <>
            <h2>{responseData?.keyKpi}</h2>
            <div>{responseData?.analytics}</div>
            <h4>Key highlights:</h4>
            <ol>
              {responseData?.keyPoints?.map((point: string, idx: number) => (
                <li key={idx}>{point}</li>
              ))}
            </ol>
            <h4>Red Flags:</h4>
            <ol>
              {responseData?.redFlags?.map((point: string, idx: number) => (
                <li key={idx}>{point}</li>
              ))}
            </ol>
          </>
        )}
      </Grid>
    </>
  );
};

export default MyResponsiveSankey;
