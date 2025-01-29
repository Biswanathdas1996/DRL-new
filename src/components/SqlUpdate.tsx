import React from "react";
import { EXICUTE_QUERY } from "../config";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateMessage } from "../redux/slices/chatSlices";
import { useFetch } from "../hook/useFetch";
// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/mode-mysql";
import AceEditor from "react-ace";
import { format } from "sql-formatter";

interface SqlUpdateProps {
  query: string;
  chatId: number;
  setLoadingUi: React.Dispatch<React.SetStateAction<boolean>>;
}

const handleFormat = (query: string): string | undefined => {
  try {
    const formatted = format(query, {
      language: "postgresql",
      tabWidth: 5,
      keywordCase: "upper",
      linesBetweenQueries: 2,
    });
    return formatted;
  } catch (error) {
    console.error("Error formatting SQL:", error);
  }
};

const SqlUpdate: React.FC<SqlUpdateProps> = ({
  query,
  chatId,
  setLoadingUi,
}) => {
  if (!chatId) return;

  const dispatch = useDispatch<AppDispatch>();
  const fetchData = useFetch();
  const [sqlQuery, setSqlQuery] = React.useState<string>(
    handleFormat(query) || ""
  );

  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingUi(true);
    const formData = new FormData(e.currentTarget);
    const getQuery = formData.get("query");
    if (getQuery) {
      setSqlQuery(getQuery.toString());
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      sql_query: sqlQuery,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetchData(EXICUTE_QUERY, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoadingUi(false);
        console.log("Result:", result);
        dispatch(
          updateMessage({
            chatId,
            result: { result: result.result, query: result.query, type: "sql" },
            llmReply:
              "<center>Please regenerate, as the data has been updated</center>",
          })
        );
      })
      .catch((error) => {
        console.error(error);
        setLoadingUi(false);
      });
  };

  return (
    <div>
      <form
        onSubmit={(e) => onsubmitHandler(e)}
        style={{ gridColumn: "span 4", marginBottom: "20px" }}
      >
        <div
          className="Input-Container"
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <AceEditor
            key="testScript"
            placeholder="Placeholder Text"
            mode="mysql"
            theme="monokai"
            name="blah2"
            fontSize={12}
            lineHeight={15}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={sqlQuery}
            onChange={(newValue) => {
              setSqlQuery(newValue);
            }}
            setOptions={{
              useWorker: false,
            }}
            editorProps={{ $blockScrolling: true }}
            //   height="400px"
            width="100%"
            style={{ padding: 10, borderRadius: 15 }}
          />
          {/* <textarea
            className="Input-Field"
            placeholder="Enter your SQL query here"
            id="query"
            name="query"
            defaultValue={sqlQuery}
            rows={8}
            cols={100}
            style={{
              height: "auto",
              fontFamily: "inherit",
              background: "#f1f1f1",
            }}
            autoCorrect="off"
            spellCheck="false"
          /> */}
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
  );
};

export default SqlUpdate;
