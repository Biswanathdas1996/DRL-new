import React from "react";
import WelcomeChatComp from "../components/WelcomeChatComp";
import UserChat from "../components/UserChat";
import LlmReply from "../components/LlmReply";
import FixedReplyTemplate from "../components/FixedReplyTemplate";
import { QUERY, CALL_GPT } from "../config";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addMessage, deleteMessage } from "../redux/slices/chatSlices";
import { useFetch } from "../hook/useFetch";
import { useQueryFilter } from "../hook/useQueryFilter";
import PreLoadedQuestions from "../components/PreLoadedQuestions";
import useChatContext from "../hook/useChatContext";
import CloseIcon from "@mui/icons-material/Close";

const Chat: React.FC = () => {
  const chatHistory = useSelector((state: RootState) => state.chat.value);
  const getContext = useChatContext(chatHistory);

  const fetchData = useFetch();
  const dispatch = useDispatch<AppDispatch>();
  const filterQuery = useQueryFilter;

  const [loading, setLoading] = React.useState<boolean>(false);

  const onsubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query");
    (e.target as HTMLFormElement).query.value = "";
    await doQuery(query as string);
  };

  const isUser = localStorage.getItem("user");
  const user = JSON.parse(isUser || "{}");

  const doQuery = async (query: string) => {
    const chatBottom = document.getElementById("chat-bottom");
    chatBottom?.scrollIntoView({ behavior: "smooth" });
    setLoading(true);

    dispatch(
      addMessage({
        id: new Date().getTime(),
        type: "user",
        message: query as string,
        time: new Date().toLocaleTimeString(),
      })
    );

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let chatContext: any = chatHistory.slice(-8);
    chatContext = chatHistory.map((chat: any) => ({
      role: chat.type === "user" ? "user" : "system",
      content:
        chat.type === "user" ? chat.message ?? "" : chat?.message?.query ?? "",
    }));

    console.log("lastTwoChats==========>", chatContext);
    // return;
    const ifLoginControl = localStorage.getItem("loginControl");
    const applyFilter = localStorage.getItem("applyFilter");

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
    console.log("=============formatInstructions", formatInstructionsText);

    const raw = JSON.stringify({
      question: applyFilter === "true" ? filterQuery(query) : query,
      controlStatement: `${
        ifLoginControl === "true"
          ? `WHERE Head Quarters (HQ) id IN (${
              user?.hq_id as string[]
            }),Make all hq_id as String`
          : ""
      }  \n ${formatInstructionsText}`,
      working_table_description: localStorage.getItem("dbJson"),
      chatContext: JSON.stringify(getContext),
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    await fetchData(QUERY, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        dispatch(
          addMessage({
            id: new Date().getTime(),
            type: "llm",
            message: result,
            time: new Date().toLocaleTimeString(),
          })
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };
  //   React.useEffect(() => {
  //     const chatScrollHolder = document.querySelector(".chat-scrollhldr");
  //     if (chatScrollHolder) {
  //       chatScrollHolder.scrollTop = chatScrollHolder.scrollHeight;
  //     }
  //   }, [chatHistory]);
  const startNewProcess = () => {
    localStorage.removeItem("chatData");
    window.location.reload();
  };

  return (
    <>
      <h2>Chat</h2>
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

            <div className="chat-scrollhldr-db">
              <button
                className="newConversationButton"
                style={{ width: "150px", height: 20 }}
                onClick={() => (window.location.href = "#/db-config")}
              >
                Database settings
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
                  alt="Clear Chat"
                />
              </button>

              <p style={{ fontSize: 10 }}>
                * generated data will be base on selected collection only
              </p>
            </div>
          </div>
          {chatHistory?.length === 0 && (
            <>
              <WelcomeChatComp />
              <div
                className="prePopulatedQuestions"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "1rem",
                }}
              >
                <PreLoadedQuestions doQuery={doQuery} />
              </div>
            </>
          )}

          <div className="chat-msg">
            {chatHistory.map((chat: any, index) => {
              return chat.type === "user" ? (
                <div key={chat.id} style={{ position: "relative" }}>
                  <UserChat
                    chat={chat}
                    onDelete={() => dispatch(deleteMessage(chat.id))}
                  />
                </div>
              ) : (
                <div key={chat.id} style={{ position: "relative" }}>
                  <LlmReply
                    chat={chat}
                    loading={loading}
                    userQuestion={chatHistory[index - 1]}
                    Delete={() => (
                      <CloseIcon
                        style={{
                          cursor: "pointer",
                          float: "right",
                        }}
                        onClick={() => dispatch(deleteMessage(chat.id))}
                      />
                    )}
                  />
                </div>
              );
            })}
            {loading && <Loader />}
          </div>
        </div>
        <div id="chat-bottom"></div>
        <form
          onSubmit={(e) => onsubmitHandler(e)}
          style={{ gridColumn: "span 4", marginBottom: "20px" }}
        >
          <div className="Input-Container" style={{ height: "auto" }}>
            <textarea
              className="Input-Field"
              placeholder="How can I help you today?"
              id="query"
              name="query"
              rows={6}
              style={{ height: "50px" }}
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

      <br />
      <br />
      <br />
    </>
  );
};

export default Chat;
