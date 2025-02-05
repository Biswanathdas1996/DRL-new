import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Card from "@mui/material/Card";
// import Bredcumbs from "../components/Bredcumbs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import DBConfig from "./DBConfig";
import Switch from "@mui/material/Switch";

export default function Config() {
  const [model, setModel] = React.useState("gpt-4o-mini");

  const [loginControl, setLoginControl] = React.useState(false);

  const handleChangeLoginControl = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginControl(event.target.checked);
    localStorage.setItem("loginControl", event.target.checked.toString());
  };

  const handleChange = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
    localStorage.setItem("model", event.target.value as string);
    window.location.reload();
  };

  React.useEffect(() => {
    const savedModel = localStorage.getItem("model");
    if (savedModel) {
      setModel(savedModel);
    }

    const ifLoginControl = localStorage.getItem("loginControl");
    if (ifLoginControl) {
      setLoginControl(ifLoginControl === "true");
    }
  }, []);

  return (
    <div>
      <h2>Configuration</h2>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Card
              style={{ padding: "20px", backgroundColor: "rgb(241 241 241)" }}
            >
              <>
                <h4>Choose a AI model</h4>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Select Model
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={model}
                      label="Age"
                      onChange={handleChange}
                    >
                      <MenuItem value={"gpt-4"}>gpt-4</MenuItem>
                      <MenuItem value={"gpt-4o"}>gpt-4o</MenuItem>
                      <MenuItem value={"gpt-4o-mini"}>gpt-4o-mini</MenuItem>
                      <MenuItem value={"gpt-4-turbo"}>GPT-4-turbo</MenuItem>
                      <MenuItem value={"gpt-3.5-turbo"}>GPT-3.5-turbo</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </>
            </Card>
          </Grid>
          <Grid size={12}>
            <h2>Database Configuration</h2>
            <Card
              style={{ padding: "20px", backgroundColor: "rgb(241 241 241)" }}
            >
              <DBConfig />
            </Card>
          </Grid>
          <Grid size={12}>
            <h2>Data Restriction</h2>
            <Card
              style={{ padding: "20px", backgroundColor: "rgb(241 241 241)" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <h4>
                  {loginControl
                    ? "Data Restricted to Logged in user"
                    : "Data is not restricted"}
                </h4>
                <Switch
                  checked={loginControl}
                  onChange={handleChangeLoginControl}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </div>
            </Card>
          </Grid>
        </Grid>

        <br />
        <br />
        <br />
      </Box>
    </div>
  );
}
