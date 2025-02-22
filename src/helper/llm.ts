import { CALL_GPT } from "../config";
import { useFetch } from "../hook/useFetch";

export const callLLM = async (query: string): Promise<string | null> => {
  const fetchData = useFetch();

  const response = await fetchData(CALL_GPT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: query,
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
