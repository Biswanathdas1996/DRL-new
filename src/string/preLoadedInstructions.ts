export const preLoadedInstructions = [
  {
    id: 1,
    value:
      "when any question for last n months, then remove the current month data from the table. n is a number",
    type: "instruction",
    status: true,
  },
  {
    id: 2,
    value:
      "In any column which has week number, append the word 'Week' to the week number.",
    type: "instruction",
    status: true,
  },
  {
    id: 3,
    value: "Remove word ID/id/Id/iD from the table",
    type: "instruction",
    status: true,
  },
  {
    id: 4,
    value: "Do not show the month number, instead show month name  ",
    type: "instruction",
    status: true,
  },
  {
    id: 5,
    value:
      "when weekly billing is asked then add the column of weekly sales achievement percentage in the table",
    type: "instruction",
    status: true,
  },
  {
    id: 6,
    value:
      "if any HQ along with hq_name is written then filter the data only for that hq",
    type: "instruction",
    status: true,
  },
  {
    id: 7,
    value:
      "if in any question previous n months is given, then ignore the current month and give for previous n months only. n is a number.",
    type: "instruction",
    status: true,
  },
];
