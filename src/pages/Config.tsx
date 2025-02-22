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

interface Field {
  id: number;
  value: string;
  type: string;
  status: boolean;
}

interface BasicTextFieldsProps {
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  usedFor: string;
}

function BasicTextFields({ fields, setFields, usedFor }: BasicTextFieldsProps) {
  const addField = (type: string) => {
    setFields([
      ...fields,
      { id: new Date().getTime(), value: "", status: true, type },
    ]);
  };

  const onChangeField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: any
  ) => {
    const newFields = fields.map((f) => {
      if (f.id === field.id) {
        return { ...f, value: e.target.value };
      }
      return f;
    });
    setFields(newFields);
  };

  return (
    <Card
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
      style={{ padding: 20, backgroundColor: "#f1f1f1" }}
    >
      {fields.map((field) => (
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          <TextField
            id={`outlined-basic-${field.id}`}
            // label={usedFor}
            variant="outlined"
            onChange={(e) => onChangeField(e, field)}
            value={field.value || ""}
            style={{ marginBottom: 10, marginTop: 10, width: "100%" }}
          />
          <Switch
            checked={field.status}
            onChange={(e) => {
              const newFields = fields.map((f) => {
                if (f.id === field.id) {
                  return { ...f, status: e.target.checked };
                }
                return f;
              });
              setFields(newFields);
            }}
            inputProps={{ "aria-label": "controlled" }}
          />
          <DeleteForeverIcon
            color="error"
            onClick={() => {
              setFields(fields.filter((f) => f.id !== field.id));
            }}
            style={{ marginLeft: 10, cursor: "pointer", fontSize: 30 }}
          />
        </div>
      ))}

      <Button
        variant="contained"
        color="warning"
        id="temp_button"
        onClick={() => addField(usedFor)}
      >
        <AddIcon /> Add More
      </Button>
    </Card>
  );
}

interface Field {
  id: number;
  value: string;
  type: string;
}

interface BasicTextFieldsProps {
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  usedFor: string;
}

export default function Config() {
  const [model, setModel] = React.useState("gpt-4o-mini");
  const [instructionForTestCases, setInstructionForTestCases] = useState<
    Field[]
  >([]);

  const [roundOff, setRoundOff] = React.useState(false);
  const [loginControl, setLoginControl] = React.useState(false);
  const [applyFilter, setApplyFilter] = React.useState(false);

  const handleChangeLoginControl = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLoginControl(event.target.checked);
    localStorage.setItem("loginControl", event.target.checked.toString());
  };

  const handleChangeRoundOff = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoundOff(event.target.checked);
    localStorage.setItem("roundOff", event.target.checked.toString());
  };

  const handleChangeApplyFilter = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setApplyFilter(event.target.checked);
    localStorage.setItem("applyFilter", event.target.checked.toString());
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

    const ifApplyFilter = localStorage.getItem("applyFilter");
    if (ifApplyFilter) {
      setApplyFilter(ifApplyFilter === "true");
    }

    const ifRoundingOff = localStorage.getItem("roundOff");
    if (ifRoundingOff) {
      setRoundOff(ifRoundingOff === "true");
    }
  }, []);

  React.useEffect(() => {
    const savedConfig = localStorage.getItem("drl_config");
    if (savedConfig) {
      const { instructionForTestCases } = JSON.parse(savedConfig);

      setInstructionForTestCases(instructionForTestCases || []);
    }
  }, []);

  React.useEffect(() => {
    if (instructionForTestCases.length === 0) {
      return;
    }
    const allInstructions = {
      instructionForTestCases,
    };
    localStorage.setItem("drl_config", JSON.stringify(allInstructions));
  }, [instructionForTestCases]);

  return (
    <div>
      <h2>Configuration</h2>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <h4>Format instructions</h4>
            <BasicTextFields
              fields={instructionForTestCases}
              setFields={setInstructionForTestCases}
              usedFor="instructionForTestCases"
            />
          </Grid>
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
          <Grid size={6}>
            <h2>Round Off Numeric Values</h2>
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
                  {roundOff
                    ? "Enabled rounding off numbers"
                    : "Disabled rounding off numbers"}
                </h4>
                <Switch
                  checked={roundOff}
                  onChange={handleChangeRoundOff}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </div>
            </Card>
          </Grid>
          <Grid size={6}>
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
          <Grid size={6}>
            <h2>Query Filters for Structured data</h2>
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
                <h4>{applyFilter ? "Filter applied" : "Filter disabled"}</h4>
                <Switch
                  checked={applyFilter}
                  onChange={handleChangeApplyFilter}
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
