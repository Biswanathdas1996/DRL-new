import React, { Component, useState } from "react";
import LineChart from "./Chart/LineChart";
import PirChart from "./Chart/PirChart";
import RadarChart from "./Chart/RadarChart";
import SunburstChart from "./Chart/SunburstChart";
import SankeyChart from "./Chart/SankeyChart";
import BarChart from "./Chart/BarChart";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CALL_GPT_FOR_JSON } from "../config";
import { useFetch } from "../hook/useFetch";

interface DataVisualizeProps {
  chatId: string;
}

const DataVisualize = ({ chatId }: DataVisualizeProps) => {
  const chatHistory = useSelector((state: RootState) => state.chat.value);
  const data =
    chatHistory.filter((chat) => chat.id === Number(chatId))[0]?.message &&
    typeof chatHistory.filter((chat) => chat.id === Number(chatId))[0]
      .message === "object" &&
    !Array.isArray(
      chatHistory.filter((chat) => chat.id === Number(chatId))[0].message
    )
      ? (
          chatHistory.filter((chat) => chat.id === Number(chatId))[0]
            .message as {
            result: any;
          }
        ).result
      : null;

  const callGpt = async (query: string): Promise<string | null> => {
    const fetchData = useFetch();

    const response = await fetchData(CALL_GPT_FOR_JSON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: query,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);

        return error;
      });
    return response;
  };

  return (
    <div>
      <LineChart data={data} callGpt={callGpt} />
      <PirChart data={data} callGpt={callGpt} />
      <RadarChart data={data} callGpt={callGpt} />
      <SunburstChart />
      <SankeyChart data={data} callGpt={callGpt} />
      <BarChart data={data} callGpt={callGpt} />
    </div>
  );
};

export default DataVisualize;
