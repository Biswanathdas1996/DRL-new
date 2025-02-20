import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface DatePickerValueProps {
  sdate: Dayjs | null;
  setSdate: (date: Dayjs | null) => void;
  edate: Dayjs | null;
  setEdate: (date: Dayjs | null) => void;
}

export default function DatePickerValue({
  sdate,
  setSdate,
  edate,
  setEdate,
}: DatePickerValueProps) {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs("2022-04-17"));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker", "DatePicker"]}>
        <DatePicker
          label="Start Date"
          value={sdate}
          onChange={(newValue) => setSdate(newValue)}
        />
        <DatePicker
          label="End Date"
          value={edate}
          onChange={(newValue) => setEdate(newValue)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
