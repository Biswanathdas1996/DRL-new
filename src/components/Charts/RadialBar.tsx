// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/radial-bar
import React, { useEffect, useState } from "react";
import { ResponsiveRadialBar } from "@nivo/radial-bar";
import { DATA_PROCESSING } from "../../config";
import { useFetch } from "../../hook/useFetch";
import Grid from "@mui/material/Grid2";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

interface MyResponsiveRadialBarProps {
  data: any;
}

const MyResponsiveRadialBar: React.FC<MyResponsiveRadialBarProps> = ({
  data,
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
            id: "<CategoryName>",
            data: [
              { x: "<SubCategory1>", y: "<Value1>" },
              { x: "<SubCategory2>", y: "<Value2>" },
            ],
          },
        ],
        analytics: "<Analytics and key insides of the data in texts>",
        howToReadTheChart:
          "<How to read the chart in texts note: this data will be used to generate the @nivo/radial-bar chart>",
        keyPoints: ["<keyPoint1>", "<keyPoint2>", "<keyPoint3>", "<keyPoint4>"],
        keyKpi: "<Key Performance Indicator>",
        redFlags: ["<RedFlag1>", "<RedFlag2>", "<and so on>"],
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
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingUi(false);
      });
  };
  useEffect(() => {
    handleSubmit();
  }, []);
  return (
    <>
      <Grid size={6}>
        <div style={{ height: 500 }}>
          {responseData && (
            <>
              <ResponsiveRadialBar
                data={responseData?.data}
                valueFormat=">-.2f"
                padding={0.4}
                cornerRadius={2}
                margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
                radialAxisStart={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                circularAxisOuter={{
                  tickSize: 5,
                  tickPadding: 12,
                  tickRotation: 0,
                }}
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
            </>
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

export default MyResponsiveRadialBar;
