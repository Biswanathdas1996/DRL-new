import React, { useEffect, useState } from "react";
import { Button, Card } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DownloadIcon from "@mui/icons-material/Download";
const RadialBar = React.lazy(() => import("../components/Charts/RadialBar"));
const Snaky = React.lazy(() => import("../components/Charts/Snaky"));
const Bump = React.lazy(() => import("../components/Charts/Bump"));
const Sunburst = React.lazy(() => import("../components/Charts/Sunburst"));
const Bar = React.lazy(() => import("../components/Charts/Bar"));

const FlowDiagramGeneration: React.FC = () => {
  const chatHistory = useSelector((state: RootState) => state.chat.value) || [];
  const [savedChartData, setSavedChartData] = useState<any>([]);
  const llmItems = chatHistory.filter((item: any) => item.type === "llm");
  console.log("chatHistory", llmItems);
  const storedData = localStorage.getItem("chartData");

  useEffect(() => {
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSavedChartData(parsedData);
      } catch (e) {
        console.error(e);
      }
    } else {
      setSavedChartData([]);
    }
  }, []);

  const renderChart = (item: any) => {
    const chartComponents = [Bar, Sunburst, Bump];
    // First, render all 3 charts for the first item
    if (item.id === llmItems[0]?.id) {
      return (
        <>
          {chartComponents.map((ChartComponent, idx) => (
            <ChartComponent
              data={item?.message?.result}
              key={item.id + "-" + idx}
            />
          ))}
        </>
      );
    }
    // For others, pick one randomly
    const ChartComponent =
      chartComponents[Math.floor(Math.random() * chartComponents.length)];

    try {
      return <ChartComponent data={item?.message?.result} key={item.id} />;
    } catch (error) {
      console.error("Error rendering chart:", error);
      return null;
    }
  };

  const renderChartByType = (data: any, index: number) => {
    switch (data.chartType) {
      case "bar":
        return <Bar key={index} data={data} chartId={data.chartId} />;
      case "bump":
        return <Bump key={index} data={data} chartId={data.chartId} />;
      case "snaky":
        return <Snaky key={index} data={data} chartId={data.chartId} />;
      case "sunBurst":
        return <Sunburst key={index} data={data} chartId={data.chartId} />;
      case "radialBar":
        return <RadialBar key={index} data={data} chartId={data.chartId} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Report</h1>
      <Card style={{ padding: 20, marginTop: 20, border: "1px solid #ccc" }}>
        <Box sx={{ flexGrow: 1 }}>
          <div id="chart-card-content">
            <Grid container spacing={2}>
              <React.Fragment>
                <React.Suspense fallback={<div>Loading chart...</div>}>
                  {Array.isArray(savedChartData) && savedChartData.length > 0
                    ? savedChartData.map((data: any, index: number) => {
                        return <>{renderChartByType(data, index)} </>;
                      })
                    : llmItems &&
                      llmItems.map((item: any, index: number) => (
                        <>{renderChart(item)}</>
                      ))}
                </React.Suspense>
              </React.Fragment>
              {/* <RadialBar data={inputText} /> */}
              {/* <Bar data={inputText} />
          <Snaky data={inputText} />
          <Bump data={inputText} />
          <Sunburst data={inputText} /> */}
            </Grid>
          </div>
        </Box>
      </Card>
      <Button
        variant="contained"
        id="temp_button"
        sx={{ mb: 2, float: "right", mt: 2, ml: 2 }}
        onClick={() => {
          localStorage.removeItem("chartData");
          setSavedChartData([]);
        }}
      >
        Re-Generate <DownloadIcon style={{ marginLeft: 10 }} />
      </Button>
      <Button
        variant="contained"
        id="temp_button"
        sx={{ mb: 2, float: "right", mt: 2 }}
        onClick={() => {
          const card = document.getElementById("chart-card-content");
          if (!card) return;
          import("html-to-image").then((htmlToImage) => {
            htmlToImage
              .toPng(card, {
                backgroundColor: "#fff",
              })
              .then((dataUrl: string) => {
                const link = document.createElement("a");
                link.download = "charts.png";
                link.href = dataUrl;
                link.click();
              });
          });
        }}
      >
        Download as PNG <DownloadIcon style={{ marginLeft: 10 }} />
      </Button>
      <br />
      <br />
      <br />
    </div>
  );
};

export default FlowDiagramGeneration;
