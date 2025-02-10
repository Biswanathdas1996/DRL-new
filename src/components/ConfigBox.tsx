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

export default function BasicTextFields({
  fields,
  setFields,
  usedFor,
}: BasicTextFieldsProps) {
  const addField = (type: string) => {
    setFields([...fields, { id: new Date().getTime(), value: "", type }]);
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
        <div style={{ display: "flex", width: "100%" }}>
          <TextField
            id={`outlined-basic-${field.id}`}
            label={usedFor}
            variant="outlined"
            onChange={(e) => onChangeField(e, field)}
            value={field.value || ""}
            style={{ marginBottom: 10, marginTop: 10, width: 300 }}
          />
          <DeleteForeverIcon
            color="error"
            onClick={() => {
              setFields(fields.filter((f) => f.id !== field.id));
            }}
            style={{ marginLeft: 10, marginTop: 30, cursor: "pointer" }}
          />
        </div>
      ))}

      <Button
        variant="contained"
        color="warning"
        onClick={() => addField(usedFor)}
      >
        <AddIcon /> Add More
      </Button>
    </Card>
  );
}
