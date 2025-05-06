// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bump
import React, { useEffect, useState } from "react";
import { ResponsiveAreaBump } from "@nivo/bump";
import { DATA_PROCESSING } from "../../config";
import { useFetch } from "../../hook/useFetch";
import Grid from "@mui/material/Grid2";

interface MyResponsiveAreaBumpProps {
  data: any;
  chartId?: number;
}

const MyResponsiveAreaBump: React.FC<MyResponsiveAreaBumpProps> = ({
  data,
  chartId,
}) => {
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
        data: [
          {
            id: "<CategoryName1>",
            data: [
              { x: "<XValue1>", y: "<YValue1>" },
              { x: "<XValue2>", y: "<YValue2>" },
            ],
          },
          {
            id: "<CategoryName2>",
            data: [
              { x: "<XValue1>", y: "<YValue1>" },
              { x: "<XValue2>", y: "<YValue2>" },
            ],
          },
        ],
        analytics: "<Analytics and key insides of the data in texts>",
        keyPoints: ["<keyPoint1>", "<keyPoint2>", "<keyPoint3>", "<keyPoint4>"],
        keyKpi: "<Key Performance Indicator>",
        redFlags: ["<RedFlag1>", "<RedFlag2>", "<and so on>"],
        howToReadTheChart:
          "<How to read the chart in texts note: this data will be used to generate the @nivo/bump chart>",
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
                  chartType: "bump",
                  chartId: Date.now(),
                });
              } else {
                // If not array, convert to array
                chartDataArr = [
                  { ...result, chartType: "bump", chartId: Date.now() },
                ];
              }
            } else {
              chartDataArr = [
                { ...result, chartType: "bump", chartId: Date.now() },
              ];
            }
            localStorage.setItem("chartData", JSON.stringify(chartDataArr));
          } catch (e) {
            console.error("Failed to save bump chart data to localStorage", e);
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
        // If chartData is an array, find the bump chart data
        const bumpChartData = parsedData.find(
          (item: any) => item.chartType === "bump" && item.chartId === chartId
        );
        setResponseData(bumpChartData);
      } catch (e) {
        console.error("Failed to parse bump chart data from localStorage", e);
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
        <div style={{ height: 400 }}>
          {responseData && (
            <ResponsiveAreaBump
              data={responseData?.data}
              margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
              spacing={8}
              colors={{ scheme: "nivo" }}
              blendMode="multiply"
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
                    id: "CoffeeScript",
                  },
                  id: "dots",
                },
                {
                  match: {
                    id: "TypeScript",
                  },
                  id: "lines",
                },
              ]}
              startLabel={(serie) => serie.id}
              endLabel={(serie) => serie.id}
              axisTop={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "",
                legendPosition: "middle",
                legendOffset: -36,
                truncateTickAt: 0,
              }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "",
                legendPosition: "middle",
                legendOffset: 32,
                truncateTickAt: 0,
              }}
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

export default MyResponsiveAreaBump;
