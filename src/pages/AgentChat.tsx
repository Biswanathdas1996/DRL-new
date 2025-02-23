import React from "react";
import WelcomeChatComp from "../components/WelcomeChatComp";
import UserChat from "../components/UserChat";
import LlmReply from "../components/LlmReply";
import { QUERY, GET_AGENT_RESPONSE, CALL_GPT } from "../config";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addMessage } from "../redux/slices/unStructureChatSlice";
import { useFetch } from "../hook/useFetch";
import ContextData from "../pages/Code/components/ContextData";
import ContextFromMongo from "../components/ContextFromMongo";
import SelectCollection from "../components/SelectCollection";

const Chat: React.FC = () => {
  const chatHistory = useSelector(
    (state: RootState) => state.unStructureChat.value
  );
  const fetchData = useFetch();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [contextDataForStory, setContextDataForStory] =
    React.useState<any>(null);

  const callGpt = async (query: string): Promise<string | null> => {
    setLoading(true);
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

  const callAgent = async (query: string): Promise<string | null> => {
    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append(
      "Cookie",
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzBmYzk0MmFmMjUzOGEyZWI0Zjg5NDIiLCJlbWFpbCI6IjQ0NmhpaUBnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzI5MDk0MTU5LCJleHAiOjE3MjkwOTc3NTl9.erRyF3fH52Islq5z5Bf0zJLWjrbszs_m5vObPomw1kw"
    );
    myHeaders.append("Content-Type", "application/json");
    const ifLoginControl = localStorage.getItem("loginControl");
    const isUser = localStorage.getItem("user");
    const user = JSON.parse(isUser || "{}");
    const savedConfig = localStorage.getItem("drl_config");
    let formatInstructions = [];

    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      formatInstructions = parsedConfig.instructionForTestCases.filter(
        (item: any) => item.status
      );
    }
    const formatInstructionsText = formatInstructions
      .map((instruction: any) => instruction.value)
      .join("\n");

    const raw = JSON.stringify({
      nlq: query,
      controlStatement: `${
        ifLoginControl === "true"
          ? `WHERE Head Quarters (HQ) id IN (${
              user?.hq_id as string[]
            }),Make all hq_id as String`
          : ""
      }  \n ${formatInstructionsText}`,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch(GET_AGENT_RESPONSE, requestOptions);
    const data = await response.json();

    const prompt = `
          Given the following response data:
          ${JSON.stringify(data.response)},
          generate an HTML code that represents this data in a descriptive and tabular view.
        `;
    const gptFormatedResponse = await callGpt(prompt);

    dispatch(
      addMessage({
        id: new Date().getTime(),
        type: "llm",
        message: gptFormatedResponse as string,
        time: new Date().toLocaleTimeString(),
      })
    );

    setLoading(false);

    return contextDataForStory;
  };

  const generateLLmResponse = async (query: string) => {
    if (query.length === 0) return;

    const userStorydata = await callAgent(query);
    console.log("userStorydata", userStorydata);
    return userStorydata;
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
    if (result) setLoading(false);

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

  const formatHtml = (text: string) => {
    const match = text.match(/```html([\s\S]*?)```/);
    return match ? match[1].trim() : null;
  };

  return (
    <>
      <h2>Argentic Q&A (SQL)</h2>
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
          </div>
          <br />
          <br />
          {!chatHistory && <WelcomeChatComp />}
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
                      <img
                        src="data:image/png;base64,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"
                        alt="Bot Icon"
                      />
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
                          dangerouslySetInnerHTML={{
                            __html: formatHtml(chat?.message) || "",
                          }}
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

        {contextDataForStory && JSON.stringify(contextDataForStory)}
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
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAddJREFUaAXtmOFtwjAQRhmhI+RnFO47ZYSO0BEYgREYgQ3aTdoN2g3oBozQ9ipOOqwkOPjsGClIyHYI8Xtnn+Nks1k/awTWCFxFgIieAZwB/AB4bdu2uTqh9gaA0wVeBPT7OCIm+gpvy/pFiOhgIm/hbb1ekUsOWNipep0iAN4jRsGK1SWy3W73MwVUpg6Rvu+fbiSzAo+Vy4vcMY2GZJYTmZnMQ/D22DIiidPICmi9rEjkPUHh5pRlRJyn0ZBgfhGnZB6Ct8fyiSTcEyxgbN1f5HJPiAXwOs9XRHKBmfdEdATwwcz6vOAFPHYdXxH7LCMjU1Asn4iVknpOMcnHsL9ibSexczHgsKOmaf6nnERRcomIZMs+K5eY+RRe173tATq0lRd4yTk34FygIbyAA9glgYt5ytCHUDFtF3CxlvdCMR16neMGrkPWdd3OC27qOu7gKkBEn1Mdp/6WDTz39MkKrtEH8JYa4fD/RcCNwNB70rGN1+TxouAiAOAljN497eLgJvpJ00e23Mx8kD2QXrNYmbL2LwquEbpn7a8CXAXmrP1VgYtA7PSpDlyjf2vtrxZcBcamT/XgKhC+yHoYcBXouq7/u4l9MfP3Yuu4wqzlGoE1Ajcj8AvY+lHSUC3vMgAAAABJRU5ErkJggg=="
                alt="Send"
                className="Send-Icon"
              />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
