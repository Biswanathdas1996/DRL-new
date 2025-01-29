import { useState, useEffect } from "react";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  redirect?: RequestRedirect;
  headers?: HeadersInit;
}

export const useFetch = (): ((
  url: string,
  requestOptions: any
) => Promise<any>) => {
  const fetchData = (
    url: string,
    requestOptions: RequestOptions
  ): Promise<any> => {
    // Add dynamic values to the request headers
    const headers = new Headers(requestOptions.headers || {});

    const selectedMode = localStorage.getItem("model");

    const userDataStr = localStorage.getItem("user");
    const userData = userDataStr ? JSON.parse(userDataStr) : null;

    headers.append("X-Ai-Model", selectedMode || "gpt-4");
    headers.append("X-DRL-USER", userData?.name + "-" + userData?.emp_code);
    // Update requestOptions with the new headers
    requestOptions.headers = headers;

    return fetch(url, requestOptions);
  };
  return fetchData;
};
