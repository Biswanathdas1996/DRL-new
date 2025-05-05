import React, { useState } from "react";
import { Button, Card } from "@mui/material";
import { useFetch } from "../hook/useFetch";
import RadialBar from "../components/Charts/RadialBar";
import Snaky from "../components/Charts/Snaky";
import Bump from "../components/Charts/Bump";
import Sunburst from "../components/Charts/Sunburst";
import Bar from "../components/Charts/Bar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DownloadIcon from "@mui/icons-material/Download";

const FlowDiagramGeneration: React.FC = () => {
  const [inputText, setInputText] = useState(`[
    {
        "HQ Name": "Hooghly",
        "Month": "October  ",
        "Sales Achievement %": "122.07",
        "Total Sales": "771721.12",
        "Total Target": "632206.00"
    },
    {
        "HQ Name": "Kolkata",
        "Month": "October  ",
        "Sales Achievement %": "107.28",
        "Total Sales": "9864019.07",
        "Total Target": "9194820.99"
    },
    {
        "HQ Name": "Ranaghat",
        "Month": "October  ",
        "Sales Achievement %": "104.18",
        "Total Sales": "513079.62",
        "Total Target": "492516.00"
    },
    {
        "HQ Name": "Siliguri",
        "Month": "October  ",
        "Sales Achievement %": "97.78",
        "Total Sales": "1070940.20",
        "Total Target": "1095276.00"
    },
    {
        "HQ Name": "Hooghly",
        "Month": "November ",
        "Sales Achievement %": "101.13",
        "Total Sales": "686019.07",
        "Total Target": "678350.00"
    },
    {
        "HQ Name": "Kolkata",
        "Month": "November ",
        "Sales Achievement %": "98.89",
        "Total Sales": "9756410.81",
        "Total Target": "9865927.00"
    },
    {
        "HQ Name": "Ranaghat",
        "Month": "November ",
        "Sales Achievement %": "98.13",
        "Total Sales": "518561.78",
        "Total Target": "528462.00"
    },
    {
        "HQ Name": "Siliguri",
        "Month": "November ",
        "Sales Achievement %": "108.00",
        "Total Sales": "1269234.35",
        "Total Target": "1175215.00"
    },
    {
        "HQ Name": "Hooghly",
        "Month": "December ",
        "Sales Achievement %": "109.53",
        "Total Sales": "743021.11",
        "Total Target": "678350.00"
    },
    {
        "HQ Name": "Kolkata",
        "Month": "December ",
        "Sales Achievement %": "102.43",
        "Total Sales": "10106047.64",
        "Total Target": "9865927.00"
    },
    {
        "HQ Name": "Ranaghat",
        "Month": "December ",
        "Sales Achievement %": "100.09",
        "Total Sales": "528922.20",
        "Total Target": "528462.00"
    },
    {
        "HQ Name": "Siliguri",
        "Month": "December ",
        "Sales Achievement %": "103.87",
        "Total Sales": "1220684.83",
        "Total Target": "1175215.00"
    }
]`);

  const chatHistory = useSelector((state: RootState) => state.chat.value) || [];

  const llmItems = chatHistory.filter((item: any) => item.type === "llm");
  console.log("chatHistory", llmItems);

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

  return (
    <div>
      <h2>Report</h2>

      <Card style={{ padding: 20, marginTop: 20, border: "1px solid #ccc" }}>
        <Button
          variant="contained"
          id="temp_button"
          sx={{ mb: 2, float: "right" }}
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
        <Box sx={{ flexGrow: 1 }}>
          <div id="chart-card-content">
            <Grid container spacing={2}>
              {llmItems &&
                llmItems.map((item: any, index: number) => (
                  <React.Fragment key={item.id + "-" + index}>
                    {renderChart(item)}
                  </React.Fragment>
                ))}
              {/* <RadialBar data={inputText} /> */}
              {/* <Bar data={inputText} />
          <Snaky data={inputText} />
          <Bump data={inputText} />
          <Sunburst data={inputText} /> */}
            </Grid>
          </div>
        </Box>
      </Card>
      <br />
      <br />
      <br />
    </div>
  );
};

export default FlowDiagramGeneration;
