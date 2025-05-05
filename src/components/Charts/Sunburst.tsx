import React, { useEffect, useState } from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { DATA_PROCESSING } from "../../config";
import { useFetch } from "../../hook/useFetch";
import Grid from "@mui/material/Grid2";

interface MyResponsiveSunburstProps {
  data: any;
}

const MyResponsiveSunburst: React.FC<MyResponsiveSunburstProps> = ({
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
        name: "<RootName>",
        color: "<RootColor>",
        children: [
          {
            name: "<ChildName1>",
            color: "<ChildColor1>",
            children: [
              {
                name: "<SubChildName1>",
                color: "<SubChildColor1>",
                children: [
                  {
                    name: "<LeafName1>",
                    color: "<LeafColor1>",
                    loc: "<LeafValue1>",
                  },
                ],
              },
            ],
          },
        ],
        analytics: "<Analytics and key insides of the data in texts>",
        keyPoints: ["<keyPoint1>", "<keyPoint2>", "<keyPoint3>", "<keyPoint4>"],
        keyKpi: "<Key Performance Indicator>",
        redFlags: ["<RedFlag1>", "<RedFlag2>", "<and so on>"],
        howToReadTheChart:
          "<How to read the chart in texts note: this data will be used to generate the @nivo/sunburst chart>",
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
            <ResponsiveSunburst
              data={responseData}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              id="name"
              value="loc"
              cornerRadius={2}
              borderColor={{ theme: "background" }}
              colors={{ scheme: "nivo" }}
              childColor={{
                from: "color",
                modifiers: [["brighter", 0.1]],
              }}
              enableArcLabels={true}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 1.4]],
              }}
            />
          )}
        </div>
        {responseData?.howToReadTheChart && (
          <div style={{ fontSize: 13 }}>{responseData?.howToReadTheChart}</div>
        )}
        {loadingUi && <div>Loading...</div>}
      </Grid>
      <Grid size={6}>
        {" "}
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

export default MyResponsiveSunburst;
