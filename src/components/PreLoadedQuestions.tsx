import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const prePopulatedQuestions = [
  "Give me the mid-month performance for current month and past two months?",
  "What is the current trends",
  "What is the total revenue?",
  "What is the total number of customers?",
];

interface BasicGridProps {
  doQuery: (query: string) => void;
}

export default function BasicGrid({ doQuery }: BasicGridProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <center>
        <Grid
          container
          spacing={2}
          style={{
            width: "90%",
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          {prePopulatedQuestions.map((question, index) => (
            <Grid
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => doQuery(question)}
            >
              <Item
                style={{
                  padding: "1.5rem",
                  minWidth: 400,
                  background: "#f1f1f1",
                  fontWeight: 500,
                }}
              >
                {question}
              </Item>
            </Grid>
          ))}
        </Grid>
      </center>
    </Box>
  );
}
