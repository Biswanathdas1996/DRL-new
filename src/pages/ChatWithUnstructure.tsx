import React from "react";
import WelcomeChatComp from "../components/WelcomeChatComp";
import UserChat from "../components/UserChat";
import LlmReply from "../components/LlmReply";
import { QUERY, SEARCH, CALL_GPT } from "../config";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addMessage } from "../redux/slices/unStructureChatSlice";
import { useFetch } from "../hook/useFetch";
import SendIcon from "@mui/icons-material/Send";
import ContextFromMongo from "../components/ContextFromMongo";
import SelectCollection from "../components/SelectCollection";
import DRL_ICON from "../assets/images/icon.png";

const Chat: React.FC = () => {
  const chatHistory = useSelector(
    (state: RootState) => state.unStructureChat.value
  );
  const fetchData = useFetch();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [contextDataForStory, setContextDataForStory] =
    React.useState<any>(null);
  const getContext = async (query: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      query: query,
      collection_name: localStorage.getItem("selected_collection"),
      no_of_results: 15,
      fine_chunking: false,
      if_gpt_summarize: false,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    return fetchData(SEARCH, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((error) => error);
  };

  const callGpt = async (query: string): Promise<string | null> => {
    setLoading(true);
    const response = await fetchData(CALL_GPT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: query,
        token_limit: 3000,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        setLoading(false);
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        return error;
      });
    return response;
  };

  const generateLLmResponse = async (query: string) => {
    if (query.length === 0) return;

    const contextData = await getContext(query);

    setContextDataForStory(contextData);
    const effectiveContext = JSON.stringify(contextData);
    // const effectiveContext = JSON.stringify(contextData?.results?.documents);
    // const effectiveContext = contextData?.results?.gpt_results;
    // const effectiveContext = contextData?.results?.fine_results;

    const contextString = contextData?.results
      ?.map((result: any) => result.text)
      .join(" ");
    console.log("effectiveContext", contextString);

    const userStorydata = await callGpt(`
      Generate a detailed response for the query: "${query}" 
      using the provided context: ${effectiveContext}.

      Requirements:
      - Format the response in HTML starting from the <body> tag.
      - Include a <h2> tag for the title.
      - Use <h4> tags for paragraphs.
      - Create bullet points with <ul> and <li> tags if necessary.
      - Highlight key points using <b> tags.
      - Use <table> tags for any tabular data.

      Additional Instructions:
      - If the answer is unclear, request more context.
      - If the answer cannot be found within the provided context, indicate that more context is needed.
      - Do not generate a response if the context does not contain relevant information.
    `);

    return userStorydata?.replace("```html", "")?.replace("```", "") as string;
  };

  const onsubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query");

    dispatch(
      addMessage({
        id: new Date().getTime(),
        type: "user",
        message: query as string,
        time: new Date().toLocaleTimeString(),
      })
    );

    const result = await generateLLmResponse(query as string);
    if (result)
      dispatch(
        addMessage({
          id: new Date().getTime(),
          type: "llm",
          message: result,
          time: new Date().toLocaleTimeString(),
        })
      );

    setLoading(false);

    (e.target as HTMLFormElement).query.value = "";
  };

  //   React.useEffect(() => {
  //     const chatScrollHolder = document.querySelector(".chat-scrollhldr");
  //     if (chatScrollHolder) {
  //       chatScrollHolder.scrollTop = chatScrollHolder.scrollHeight;
  //     }
  //   }, [chatHistory]);

  const startNewProcess = () => {
    localStorage.removeItem("chatData-unstructure");
    window.location.reload();
  };

  return (
    <>
      <h2>Q&A (Unstructure)</h2>
      <div className="chat-hldr">
        <div className="chat-scrollhldr">
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <button
                className="newConversationButton"
                style={{ width: "100px", height: 20 }}
                onClick={() => startNewProcess()}
              >
                Start new
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
                  alt="Clear Chat"
                />
              </button>
              <p style={{ fontSize: 10, marginTop: 0 }}>
                * Old data will be cleared on starting new
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              <SelectCollection />

              <p style={{ fontSize: 10 }}>
                * generated data will be base on selected collection only
              </p>
            </div>
          </div>
          <br />
          <br />
          {chatHistory?.length === 0 && <WelcomeChatComp />}
          <div className="chat-msg">
            {chatHistory.map((chat: any, index) => {
              return chat.type === "user" ? (
                <UserChat chat={chat} key={chat.id} />
              ) : (
                <>
                  <div
                    data-name="message-1"
                    className="chat-msg-list msg-hldr-cb "
                    key={`chat-${chat.id}`}
                  >
                    <div className="icon-hldr">
                      {/* <img
                        src="data:image/png;base64,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"
                        alt="Bot Icon"
                      /> */}
                      <img src={DRL_ICON} alt="Bot Icon" />
                    </div>
                    <div
                      data-name="message-stack-1"
                      className="chat-msg-stack"
                      style={{
                        border: "1px solid #f1f1f1",
                        padding: 20,
                        fontSize: 12,
                        borderRadius: 15,
                        background: "#f1f1f1",
                      }}
                    >
                      <div className="chat-indv" style={{ all: "unset" }}>
                        <div
                          style={{ all: "unset" }}
                          dangerouslySetInnerHTML={{ __html: chat?.message }}
                        />
                        {/* {JSON.stringify(chat?.message)} */}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
            {loading && <Loader />}
          </div>
        </div>

        <form
          onSubmit={(e) => onsubmitHandler(e)}
          style={{ gridColumn: "span 4", marginBottom: "20px" }}
        >
          <div className="Input-Container">
            <input
              className="Input-Field"
              type="text"
              placeholder="How can I help you today?"
              id="query"
              name="query"
            />
            <button className="Send-Button" type="submit">
              <div
                style={{
                  background: "#4b2a91",
                  padding: 11,
                  borderRadius: "50%",
                  color: "white",
                }}
              >
                <SendIcon style={{ fontSize: 23 }} />
              </div>
            </button>
          </div>
        </form>
        {contextDataForStory && (
          <ContextFromMongo data={contextDataForStory?.results as any} />
        )}
      </div>
    </>
  );
};

export default Chat;
