// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useEffect, useState } from "react";
import { DATA_PROCESSING } from "../../config";
import { useFetch } from "../../hook/useFetch";
import Grid from "@mui/material/Grid2";
// make sure parent container have a defined height when using

interface MyResponsiveBarProps {
  data: any;
  chartId?: number;
}

const MyResponsiveBar: React.FC<MyResponsiveBarProps> = ({ data, chartId }) => {
  const [loadingUi, setLoadingUi] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [inputText, setInputText] = useState<string>("");
  const fetchData = useFetch();

  const handleSubmit = () => {
    setLoadingUi(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      data: data,
      sample_output_template: JSON.stringify({
        keys: ["<Category1>", "<Category2>", "<Category3>", "..."],
        indexBy: "<IndexField>",
        fill: [
          {
            match: {
              id: "<Category1>",
            },
            id: "<Pattern1>",
          },
          {
            match: {
              id: "<Category2>",
            },
            id: "<Pattern2>",
          },
        ],
        data: [
          {
            "<IndexField>": "<IndexValue1>",
            "<Category1>": "<Value1>",
            "<Category1>Color": "<Color1>",
            "<Category2>": "<Value2>",
            "<Category2>Color": "<Color2>",
            "<Category3>": "<Value3>",
            "<Category3>Color": "<Color3>",
          },
          {
            "<IndexField>": "<IndexValue2>",
            "<Category1>": "<Value4>",
            "<Category1>Color": "<Color4>",
            "<Category2>": "<Value5>",
            "<Category2>Color": "<Color5>",
            "<Category3>": "<Value6>",
            "<Category3>Color": "<Color6>",
          },
        ],
        analytics: "<Analytics and key insides of the data in texts>",
        keyPoints: ["<keyPoint1>", "<keyPoint2>", "<keyPoint3>", "<keyPoint4>"],
        keyKpi: "<Key Performance Indicator>",
        redFlags: ["<RedFlag1>", "<RedFlag2>", "<and so on>"],
        howToReadTheChart:
          "<How to read the chart in texts note: this data will be used to generate the @nivo/bar chart>",
      }),
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
                  chartType: "bar",
                  chartId: Date.now(),
                });
              } else {
                // If not array, convert to array
                chartDataArr = [
                  { ...result, chartType: "bar", chartId: Date.now() },
                ];
              }
            } else {
              chartDataArr = [
                { ...result, chartType: "bar", chartId: Date.now() },
              ];
            }
            localStorage.setItem("chartData", JSON.stringify(chartDataArr));
          } catch (e) {
            console.error("Failed to save bar chart data to localStorage", e);
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
        // If chartData is an array, find the bar chart data
        const barChartData = parsedData.find(
          (item: any) => item.chartType === "bar" && item.chartId === chartId
        );
        setResponseData(barChartData);
      } catch (e) {
        console.error("Failed to parse bar chart data from localStorage", e);
        handleSubmit();
      }
    } else {
      handleSubmit();
    }
  }, []);

  return (
    <>
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
      <Grid size={6}>
        <div style={{ height: 500 }}>
          {responseData && (
            <ResponsiveBar
              data={responseData?.data}
              keys={responseData?.keys}
              indexBy={responseData?.indexBy}
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              //   groupMode="grouped"
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
              fill={responseData?.fill}
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
                legend: responseData?.indexBy,
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
                e.id +
                ": " +
                e.formattedValue +
                ` in ${responseData?.keys}: ` +
                e.indexValue
              }
            />
          )}
        </div>
        {responseData?.howToReadTheChart && (
          <div style={{ fontSize: 13 }}>{responseData?.howToReadTheChart}</div>
        )}
        {loadingUi && <div>Loading...</div>}
      </Grid>
    </>
  );
};

export default MyResponsiveBar;
function fetchData(DATA_PROCESSING: any, requestOptions: RequestInit) {
  throw new Error("Function not implemented.");
}
