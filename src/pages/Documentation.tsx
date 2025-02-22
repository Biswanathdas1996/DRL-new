import React, { useEffect } from "react";
import { callLLM } from "../helper/llm";
import { uiData as data } from "../string/documentation";
import { dbSchema } from "../string/dbSchema";
import { TextField, Button, Card } from "@mui/material";
import Loader from "../components/Loader";

const Documentation: React.FC = () => {
  const [prompts, setPrompts] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const fetchPrompt = async () => {
    setLoading(true);
    const promptInput = (
      document.getElementById("promptInput") as HTMLInputElement
    ).value;
    callLLM(`
        Refactor the following prompt to correctly generate a SQL query for the given schema:
        "${promptInput}"

        Schema:
        ${dbSchema}

        # Provide only the corrected prompt statement, do not include the schema information.
        `).then((res: any) => {
      setPrompts(res);
      setLoading(false);
    });
  };

  return (
    <div>
      <h1>{data.title}</h1>

      {data.sections.map((section, index) => (
        <div key={index}>
          <h2>{section.title}</h2>
          {section.content && (
            <ul>
              {section.content.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
          {section.subsections &&
            section.subsections.map((subsection, subIndex) => (
              <div key={subIndex}>
                <h3>{subsection.title}</h3>
                <p>{subsection.description}</p>
                <ul>
                  {subsection.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex}>{example}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      ))}
      <Card
        style={{ padding: "20px", marginTop: "20px", marginBottom: "6rem" }}
      >
        <h2>Try yourself</h2>
        <p>Try prompts in your own words, let AI fix your prompts</p>

        {prompts && (
          <p>
            Prompt: <b>{prompts}</b>
          </p>
        )}
        {loading && <Loader showIcon={false} />}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPrompt();
          }}
          style={{ display: "flex" }}
        >
          <TextField
            id="promptInput"
            label="Enter your question"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <br />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ height: 50, margin: 20 }}
          >
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Documentation;
