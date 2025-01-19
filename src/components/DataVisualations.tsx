import React, { Component, useState } from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import PirChart from "./PirChart";
import RadarChart from "./RadarChart";
import { QueryData } from "../types/LLM";
import { ANALITICS } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addAnalitics } from "../redux/slices/chatSlices";
import { Card } from "@mui/material";
import ChartSwitch from "./ChartSwitch";
import Loader from "./Loader";
import { Button } from "@mui/material";
import html2canvas from "html2canvas";
import { useFetch } from "../hook/useFetch";

interface HomeProps {
  data: QueryData;
}

const DynamicChart: React.FC<any> = ({ index, chatData, chartConfig }) => {
  const [chartView, setChartView] = useState<any>(chartConfig.type);

  const chartMaps = [
    {
      type: "Line Chart",
      component: LineChart,
    },
    {
      type: "Bar Chart",
      component: BarChart,
    },
    {
      type: "Pie Chart",
      component: PirChart,
    },
    {
      type: "Stacked Bar Chart",
      component: BarChart,
    },
    {
      type: "Scatter Plot",
      component: RadarChart,
    },
  ];

  const getChartComponent = (type: string): React.FC<any> | null => {
    const chart = chartMaps.find((chartMap) => chartMap.type === type);
    return chart ? chart.component : BarChart;
  };
  const ChartComponent = getChartComponent(chartView);

  const downloadChartAsImage = () => {
    const chartElement = document.querySelector(`#chart-${index}`);
    if (chartElement) {
      html2canvas(chartElement as HTMLElement).then(
        (canvas: HTMLCanvasElement) => {
          const link = document.createElement("a");
          link.download = `chart-${index}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }
      );
    }
  };
  return ChartComponent ? (
    <Card style={{ padding: 10, margin: 30, width: 750 }}>
      <ChartSwitch
        setChartView={setChartView}
        defaultType={chartView}
        downloadChartAsImage={downloadChartAsImage}
      />

      <div id={`chart-${index}`}>
        <ChartComponent
          key={index}
          chatData={chatData}
          chartConfig={chartConfig}
        />
      </div>
    </Card>
  ) : null;
};

const DataVisualations: React.FC<HomeProps> = ({ data }) => {
  if (data?.result?.length === 0) {
    return "Some Error Occured, switch back to table view";
  }

  return (
    <div>
      {data?.analytics?.map((chart, index) => {
        return (
          <>
            <DynamicChart
              key={index}
              index={index}
              chatData={data}
              chartConfig={chart}
            />
            {/* <BarChart key={index} chatData={data} chartConfig={chart} /> */}
          </>
        );
      })}
    </div>
  );
};

export default DataVisualations;
