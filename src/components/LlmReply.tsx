import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { addLLMReply } from "../redux/slices/chatSlices";
import { QueryData } from "../types/LLM";
import Table from "./Table";
import Analyse from "./Analyse";
import SqlUpdate from "./SqlUpdate";
import { SAVE_QUERY, FEEDBACK } from "../config";
import { useAlert } from "../hook/useAlert";
import { useFetch } from "../hook/useFetch";
import Loader from "./Loader";
import { UserContext } from "../App";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DRL_ICON from "../assets/images/icon.png";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FeedbackComp from "./Feedback";

interface LlmReplyProps {
  loading: boolean;
  chat: {
    id: number;
    type: string;
    message: QueryData;
    time: string;
  };
  userQuestion: any;
  Delete: any;
  index?: number;
}

const LlmReply: React.FC<LlmReplyProps> = ({
  chat,
  userQuestion,
  Delete,
  index,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { message, time, id } = chat;
  const fetchData = useFetch();
  const [loadingUi, setLoadingUi] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showAnaliticsSection, setShowAnaliticsSection] =
    React.useState<boolean>(false);
  const [showQueryEditSection, setShowQueryEditSection] =
    React.useState<boolean>(false);

  const { user } = useContext(UserContext);

  const { triggerAlert } = useAlert();

  const isSingleResponse: boolean =
    typeof message.result === "string" || typeof message?.result === "number";

  // const generateGPTResponse = async () => {
  //   if (!message.result || message.llmReply) return;
  //   const effectiveContext = JSON.stringify(message.result);

  //   const userStorydata = await callGpt(`
  //         Generate a summarized and structured response for the data: ${effectiveContext}

  //         Response should be intaractive and user friendly
  //         Response should be discreptive and easy to understand
  //         Generate HTML code from <body> tag for the same
  //         Use <h2> tag for heading and <p> tag for paragraph
  //         do not include texts like "This HTML code presents..." or "This is a structured response..." etc
  //         `);
  //   dispatch(
  //     addLLMReply({
  //       chatId: id,
  //       llmReply: userStorydata?.replace("```html", "").replace("```", ""),
  //     })
  //   );
  //   return userStorydata?.replace("```html", "") as string;
  // };

  // useEffect(() => {
  //   generateGPTResponse();
  // }, []);

  const saveQuery = (questionLabel: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      data: {
        id: new Date().getTime(),
        name: questionLabel,
        query: message?.query,
        use: "Static",
        questions: [],
      },
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetchData(SAVE_QUERY, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        triggerAlert("Query Saved Successfully!", "success");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div
      data-name="message-1"
      className="chat-msg-list msg-hldr-cb gap10px"
      key={id}
    >
      <div className="icon-hldr">
        {/* <img
          src="data:image/png;base64,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"
          alt="Bot Icon"
        /> */}
        <img src={DRL_ICON} alt="Bot Icon" />
      </div>
      <div data-name="message-stack-1" className="chat-msg-stack">
        <div className="chat-indv">
          <div className="bot-message">
            <>
              <Delete />
              {index === 1 && <h3>Certainly, {user?.name}!</h3>}
              <div
                style={{ fontSize: "14px", fontWeight: "400", marginTop: 10 }}
              >
                As per your query{" "}
                <b>
                  {userQuestion &&
                    typeof userQuestion.message === "string" &&
                    userQuestion.message
                      .toLowerCase()
                      .replace("?", "")
                      .replace("what is", "")
                      .replace("what", "")
                      .replace("give me", "")
                      .replace("which", "")}
                  :
                </b>
              </div>
              <div style={{ marginBottom: "20px", fontSize: "14px" }}>
                <span> {message?.summery}</span>
              </div>
              <br />

              <>
                <div>
                  {message?.query?.includes("error") ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <WarningAmberIcon style={{ color: "#e0786e" }} />{" "}
                      <span style={{ marginLeft: 5 }}>{message?.query}</span>
                    </div>
                  ) : (
                    <div style={{ width: "100%" }}>
                      <Table
                        loadingUi={loadingUi}
                        chatId={id}
                        userQuestion={userQuestion}
                      />
                    </div>
                  )}
                </div>
              </>

              <div
                style={{ fontSize: "14px", fontWeight: "400", marginTop: 20 }}
              >
                Thank you for your query, We look forward to helping you again!
              </div>
            </>
          </div>
          {showQueryEditSection && (
            <SqlUpdate
              query={message?.query}
              chatId={id}
              setLoadingUi={setLoadingUi}
            />
          )}

          {!loading ? (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="newConversationButton"
                onClick={() => setShowQueryEditSection(!showQueryEditSection)}
                style={{
                  display: showAnaliticsSection ? "none" : undefined,
                  background: showQueryEditSection ? "#4b2a91" : "#989595",
                }}
              >
                {showQueryEditSection ? "Hide" : "SQL"}
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
                  alt="Clear Chat"
                />
              </button>
              <button
                className="newConversationButton"
                style={{
                  display: showAnaliticsSection ? "none" : undefined,
                  background: "#989595",
                }}
                onClick={() => {
                  const questionLabel = prompt(
                    "Enter your label",
                    "Question 1"
                  );
                  if (questionLabel) {
                    saveQuery(questionLabel);
                  }
                }}
              >
                Save
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
                  alt="Clear Chat"
                />
              </button>
              <FeedbackComp chat={chat} />
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <b>Saving Feedback...</b>
            </div>
          )}

          <span className="chat-time chat-time-usr">{time}</span>
        </div>
      </div>

      {/*  */}
    </div>
  );
};

export default LlmReply;
