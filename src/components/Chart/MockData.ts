// Sample data for the line chart
export const lineChartDataTemplate = {
  id: "string", // Unique identifier for the dataset
  color: "string", // Color in hsl format or any valid color string
  data: [
    {
      x: "string", // Label for the x-axis
      y: "number", // Value for the y-axis
    },
    // Add more data points as needed
  ],
};

export const lineChartData = [
  {
    id: "japan",
    color: "hsl(29, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 117,
      },
      {
        x: "helicopter",
        y: 250,
      },
    ],
  },
  {
    id: "france",
    color: "hsl(122, 70%, 50%)",
    data: [
      {
        x: "plane",
        y: 295,
      },
      {
        x: "helicopter",
        y: 273,
      },
      {
        x: "boat",
        y: 98,
      },
    ],
  },
];

// Template for bar chart data
export const barChartDataTemplate = (categories: string[]) => [
  {
    country: "string", // Country code or name
    ...categories.reduce((acc: Record<string, any>, category) => {
      acc[category] = "number"; // Value for the category
      acc[`${category}Color`] = "string"; // Color in hsl format or any valid color string
      return acc;
    }, {}),
  },
  // Add more countries as needed
];

// Example bar chart data
export const barChartData = [
  {
    country: "AD",
    "hot dog": 160,
    "hot dogColor": "hsl(247, 70%, 50%)",
    burger: 193,
    burgerColor: "hsl(43, 70%, 50%)",
    sandwich: 126,
    sandwichColor: "hsl(304, 70%, 50%)",
    kebab: 6,
    kebabColor: "hsl(267, 70%, 50%)",
    fries: 51,
    friesColor: "hsl(133, 70%, 50%)",
    donut: 90,
    donutColor: "hsl(130, 70%, 50%)",
  },
  {
    country: "AE",
    "hot dog": 169,
    "hot dogColor": "hsl(354, 70%, 50%)",
    burger: 83,
    burgerColor: "hsl(161, 70%, 50%)",
    sandwich: 3,
    sandwichColor: "hsl(79, 70%, 50%)",
    kebab: 109,
    kebabColor: "hsl(139, 70%, 50%)",
    fries: 183,
    friesColor: "hsl(114, 70%, 50%)",
    donut: 42,
    donutColor: "hsl(142, 70%, 50%)",
  },
  {
    country: "AF",
    "hot dog": 63,
    "hot dogColor": "hsl(55, 70%, 50%)",
    burger: 26,
    burgerColor: "hsl(354, 70%, 50%)",
    sandwich: 157,
    sandwichColor: "hsl(292, 70%, 50%)",
    kebab: 192,
    kebabColor: "hsl(223, 70%, 50%)",
    fries: 84,
    friesColor: "hsl(168, 70%, 50%)",
    donut: 179,
    donutColor: "hsl(84, 70%, 50%)",
  },
  {
    country: "AG",
    "hot dog": 104,
    "hot dogColor": "hsl(306, 70%, 50%)",
    burger: 161,
    burgerColor: "hsl(68, 70%, 50%)",
    sandwich: 16,
    sandwichColor: "hsl(102, 70%, 50%)",
    kebab: 46,
    kebabColor: "hsl(5, 70%, 50%)",
    fries: 43,
    friesColor: "hsl(357, 70%, 50%)",
    donut: 30,
    donutColor: "hsl(177, 70%, 50%)",
  },
  {
    country: "AI",
    "hot dog": 74,
    "hot dogColor": "hsl(293, 70%, 50%)",
    burger: 131,
    burgerColor: "hsl(338, 70%, 50%)",
    sandwich: 116,
    sandwichColor: "hsl(62, 70%, 50%)",
    kebab: 102,
    kebabColor: "hsl(77, 70%, 50%)",
    fries: 166,
    friesColor: "hsl(59, 70%, 50%)",
    donut: 68,
    donutColor: "hsl(193, 70%, 50%)",
  },
  {
    country: "AL",
    "hot dog": 49,
    "hot dogColor": "hsl(282, 70%, 50%)",
    burger: 151,
    burgerColor: "hsl(335, 70%, 50%)",
    sandwich: 132,
    sandwichColor: "hsl(345, 70%, 50%)",
    kebab: 58,
    kebabColor: "hsl(184, 70%, 50%)",
    fries: 7,
    friesColor: "hsl(58, 70%, 50%)",
    donut: 29,
    donutColor: "hsl(29, 70%, 50%)",
  },
  {
    country: "AM",
    "hot dog": 147,
    "hot dogColor": "hsl(351, 70%, 50%)",
    burger: 159,
    burgerColor: "hsl(305, 70%, 50%)",
    sandwich: 189,
    sandwichColor: "hsl(157, 70%, 50%)",
    kebab: 159,
    kebabColor: "hsl(167, 70%, 50%)",
    fries: 70,
    friesColor: "hsl(162, 70%, 50%)",
    donut: 44,
    donutColor: "hsl(57, 70%, 50%)",
  },
];

export const radarChartDataTemplate = [
  {
    category: "string", // Name of the category
    ...["string1", "string2", "string3"].reduce(
      (acc: Record<string, any>, key) => {
        acc[key] = "number"; // Value for each key
        return acc;
      },
      {}
    ),
  },
  // Add more categories as needed
];
export const radarChartData = [
  {
    Raoul: 49,
    Josiane: 38,
    Marcel: 89,
    René: 166,
    Paul: 21,
    Jacques: 122,
  },
  {
    Raoul: 20,
    Josiane: 36,
    Marcel: 20,
    René: 103,
    Paul: 161,
    Jacques: 89,
  },
  {
    Raoul: 174,
    Josiane: 20,
    Marcel: 65,
    René: 160,
    Paul: 23,
    Jacques: 79,
  },
  {
    Raoul: 99,
    Josiane: 67,
    Marcel: 14,
    René: 55,
    Paul: 21,
    Jacques: 200,
  },
  {
    Raoul: 102,
    Josiane: 104,
    Marcel: 152,
    René: 145,
    Paul: 187,
    Jacques: 117,
  },
  {
    Raoul: 173,
    Josiane: 19,
    Marcel: 184,
    René: 117,
    Paul: 184,
    Jacques: 75,
  },
  {
    Raoul: 11,
    Josiane: 152,
    Marcel: 106,
    René: 126,
    Paul: 127,
    Jacques: 138,
  },
  {
    Raoul: 142,
    Josiane: 166,
    Marcel: 44,
    René: 40,
    Paul: 112,
    Jacques: 23,
  },
  {
    Raoul: 65,
    Josiane: 59,
    Marcel: 117,
    René: 177,
    Paul: 58,
    Jacques: 114,
  },
];

export const snakeyChartData = {
  nodes: [
    {
      id: "John",
      nodeColor: "hsl(10, 70%, 50%)",
    },
    {
      id: "Raoul",
      nodeColor: "hsl(89, 70%, 50%)",
    },
    {
      id: "Jane",
      nodeColor: "hsl(333, 70%, 50%)",
    },
    {
      id: "Marcel",
      nodeColor: "hsl(309, 70%, 50%)",
    },
    {
      id: "Ibrahim",
      nodeColor: "hsl(103, 70%, 50%)",
    },
    {
      id: "Junko",
      nodeColor: "hsl(103, 70%, 50%)",
    },
  ],
  links: [
    {
      source: "Raoul",
      target: "Ibrahim",
      value: 164,
    },
    {
      source: "Raoul",
      target: "Junko",
      value: 100,
    },
    {
      source: "Raoul",
      target: "Jane",
      value: 46,
    },
    {
      source: "Raoul",
      target: "Marcel",
      value: 7,
    },
    {
      source: "John",
      target: "Raoul",
      value: 65,
    },
    {
      source: "Marcel",
      target: "Jane",
      value: 121,
    },
    {
      source: "Marcel",
      target: "Ibrahim",
      value: 151,
    },
    {
      source: "Jane",
      target: "Ibrahim",
      value: 185,
    },
    {
      source: "Junko",
      target: "Ibrahim",
      value: 53,
    },
  ],
};
// Template for snakey chart data
export const snakeyChartDataTemplate = {
  nodes: [
    {
      id: "string", // Unique identifier for the node
      nodeColor: "string", // Color in hsl format or any valid color string
    },
    // Add more nodes as needed
  ],
  links: [
    {
      source: "string", // Source node identifier
      target: "string", // Target node identifier
      value: "number", // Value representing the link strength
    },
    // Add more links as needed
  ],
};

export const sunBurstChartData = {
  name: "nivo",
  color: "hsl(282, 70%, 50%)",
  children: [
    {
      name: "viz",
      color: "hsl(57, 70%, 50%)",
      children: [
        {
          name: "stack",
          color: "hsl(72, 70%, 50%)",
          children: [
            {
              name: "cchart",
              color: "hsl(268, 70%, 50%)",
              loc: 173265,
            },
            {
              name: "xAxis",
              color: "hsl(206, 70%, 50%)",
              loc: 107647,
            },
            {
              name: "yAxis",
              color: "hsl(356, 70%, 50%)",
              loc: 125553,
            },
            {
              name: "layers",
              color: "hsl(337, 70%, 50%)",
              loc: 38524,
            },
          ],
        },
        {
          name: "ppie",
          color: "hsl(76, 70%, 50%)",
          children: [
            {
              name: "chart",
              color: "hsl(80, 70%, 50%)",
              children: [
                {
                  name: "pie",
                  color: "hsl(274, 70%, 50%)",
                  children: [
                    {
                      name: "outline",
                      color: "hsl(112, 70%, 50%)",
                      loc: 107121,
                    },
                    {
                      name: "slices",
                      color: "hsl(149, 70%, 50%)",
                      loc: 65632,
                    },
                    {
                      name: "bbox",
                      color: "hsl(231, 70%, 50%)",
                      loc: 191851,
                    },
                  ],
                },
                {
                  name: "donut",
                  color: "hsl(2, 70%, 50%)",
                  loc: 85412,
                },
                {
                  name: "gauge",
                  color: "hsl(18, 70%, 50%)",
                  loc: 63501,
                },
              ],
            },
            {
              name: "legends",
              color: "hsl(346, 70%, 50%)",
              loc: 94207,
            },
          ],
        },
      ],
    },
    {
      name: "colors",
      color: "hsl(128, 70%, 50%)",
      children: [
        {
          name: "rgb",
          color: "hsl(148, 70%, 50%)",
          loc: 83068,
        },
        {
          name: "hsl",
          color: "hsl(180, 70%, 50%)",
          loc: 182168,
        },
      ],
    },
    {
      name: "utils",
      color: "hsl(344, 70%, 50%)",
      children: [
        {
          name: "randomize",
          color: "hsl(322, 70%, 50%)",
          loc: 32116,
        },
        {
          name: "resetClock",
          color: "hsl(2, 70%, 50%)",
          loc: 150520,
        },
        {
          name: "noop",
          color: "hsl(213, 70%, 50%)",
          loc: 178321,
        },
        {
          name: "tick",
          color: "hsl(338, 70%, 50%)",
          loc: 1081,
        },
        {
          name: "forceGC",
          color: "hsl(275, 70%, 50%)",
          loc: 150578,
        },
        {
          name: "stackTrace",
          color: "hsl(265, 70%, 50%)",
          loc: 13744,
        },
        {
          name: "dbg",
          color: "hsl(346, 70%, 50%)",
          loc: 117397,
        },
      ],
    },
    {
      name: "generators",
      color: "hsl(88, 70%, 50%)",
      children: [
        {
          name: "address",
          color: "hsl(126, 70%, 50%)",
          loc: 169575,
        },
        {
          name: "city",
          color: "hsl(289, 70%, 50%)",
          loc: 395,
        },
        {
          name: "animal",
          color: "hsl(126, 70%, 50%)",
          loc: 63688,
        },
        {
          name: "movie",
          color: "hsl(316, 70%, 50%)",
          loc: 136654,
        },
        {
          name: "user",
          color: "hsl(152, 70%, 50%)",
          loc: 144656,
        },
      ],
    },
    {
      name: "set",
      color: "hsl(203, 70%, 50%)",
      children: [
        {
          name: "clone",
          color: "hsl(183, 70%, 50%)",
          loc: 181621,
        },
        {
          name: "intersect",
          color: "hsl(347, 70%, 50%)",
          loc: 9036,
        },
        {
          name: "merge",
          color: "hsl(85, 70%, 50%)",
          loc: 101833,
        },
        {
          name: "reverse",
          color: "hsl(16, 70%, 50%)",
          loc: 180794,
        },
        {
          name: "toArray",
          color: "hsl(294, 70%, 50%)",
          loc: 35553,
        },
        {
          name: "toObject",
          color: "hsl(339, 70%, 50%)",
          loc: 98385,
        },
        {
          name: "fromCSV",
          color: "hsl(233, 70%, 50%)",
          loc: 2170,
        },
        {
          name: "slice",
          color: "hsl(267, 70%, 50%)",
          loc: 111358,
        },
        {
          name: "append",
          color: "hsl(281, 70%, 50%)",
          loc: 123745,
        },
        {
          name: "prepend",
          color: "hsl(23, 70%, 50%)",
          loc: 41097,
        },
        {
          name: "shuffle",
          color: "hsl(182, 70%, 50%)",
          loc: 149946,
        },
        {
          name: "pick",
          color: "hsl(152, 70%, 50%)",
          loc: 159493,
        },
        {
          name: "plouc",
          color: "hsl(164, 70%, 50%)",
          loc: 64244,
        },
      ],
    },
    {
      name: "text",
      color: "hsl(41, 70%, 50%)",
      children: [
        {
          name: "trim",
          color: "hsl(329, 70%, 50%)",
          loc: 175280,
        },
        {
          name: "slugify",
          color: "hsl(67, 70%, 50%)",
          loc: 194596,
        },
        {
          name: "snakeCase",
          color: "hsl(344, 70%, 50%)",
          loc: 198576,
        },
        {
          name: "camelCase",
          color: "hsl(335, 70%, 50%)",
          loc: 140570,
        },
        {
          name: "repeat",
          color: "hsl(141, 70%, 50%)",
          loc: 179385,
        },
        {
          name: "padLeft",
          color: "hsl(225, 70%, 50%)",
          loc: 114537,
        },
        {
          name: "padRight",
          color: "hsl(243, 70%, 50%)",
          loc: 103050,
        },
        {
          name: "sanitize",
          color: "hsl(317, 70%, 50%)",
          loc: 87033,
        },
        {
          name: "ploucify",
          color: "hsl(240, 70%, 50%)",
          loc: 116153,
        },
      ],
    },
    {
      name: "misc",
      color: "hsl(313, 70%, 50%)",
      children: [
        {
          name: "greetings",
          color: "hsl(191, 70%, 50%)",
          children: [
            {
              name: "hey",
              color: "hsl(87, 70%, 50%)",
              loc: 47941,
            },
            {
              name: "HOWDY",
              color: "hsl(352, 70%, 50%)",
              loc: 186632,
            },
            {
              name: "aloha",
              color: "hsl(49, 70%, 50%)",
              loc: 47011,
            },
            {
              name: "AHOY",
              color: "hsl(198, 70%, 50%)",
              loc: 153607,
            },
          ],
        },
        {
          name: "other",
          color: "hsl(157, 70%, 50%)",
          loc: 194704,
        },
        {
          name: "path",
          color: "hsl(55, 70%, 50%)",
          children: [
            {
              name: "pathA",
              color: "hsl(287, 70%, 50%)",
              loc: 189394,
            },
            {
              name: "pathB",
              color: "hsl(213, 70%, 50%)",
              children: [
                {
                  name: "pathB1",
                  color: "hsl(229, 70%, 50%)",
                  loc: 197522,
                },
                {
                  name: "pathB2",
                  color: "hsl(152, 70%, 50%)",
                  loc: 97346,
                },
                {
                  name: "pathB3",
                  color: "hsl(330, 70%, 50%)",
                  loc: 91329,
                },
                {
                  name: "pathB4",
                  color: "hsl(59, 70%, 50%)",
                  loc: 145897,
                },
              ],
            },
            {
              name: "pathC",
              color: "hsl(143, 70%, 50%)",
              children: [
                {
                  name: "pathC1",
                  color: "hsl(290, 70%, 50%)",
                  loc: 5581,
                },
                {
                  name: "pathC2",
                  color: "hsl(295, 70%, 50%)",
                  loc: 14182,
                },
                {
                  name: "pathC3",
                  color: "hsl(346, 70%, 50%)",
                  loc: 54380,
                },
                {
                  name: "pathC4",
                  color: "hsl(158, 70%, 50%)",
                  loc: 71552,
                },
                {
                  name: "pathC5",
                  color: "hsl(349, 70%, 50%)",
                  loc: 177257,
                },
                {
                  name: "pathC6",
                  color: "hsl(149, 70%, 50%)",
                  loc: 6691,
                },
                {
                  name: "pathC7",
                  color: "hsl(296, 70%, 50%)",
                  loc: 61158,
                },
                {
                  name: "pathC8",
                  color: "hsl(234, 70%, 50%)",
                  loc: 207,
                },
                {
                  name: "pathC9",
                  color: "hsl(306, 70%, 50%)",
                  loc: 75329,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
// make a trmplate of the same that can be fit as a referance to LLM to generate a output as the same
// Template for pie chart data
export const pieChartDataTemplate = {
  id: "string", // Identifier for the category
  data: [
    {
      x: "string", // Label for the data point
      y: "number", // Value for the data point
    },
    // Add more data points as needed
  ],
};

export const pieChartData = [
  {
    id: "Supermarket",
    data: [
      {
        x: "Vegetables",
        y: 10,
      },
      {
        x: "Fruits",
        y: 20,
      },
      {
        x: "Meat",
        y: 134,
      },
    ],
  },
  {
    id: "Combini",
    data: [
      {
        x: "Vegetables",
        y: 18,
      },
      {
        x: "Fruits",
        y: 269,
      },
      {
        x: "Meat",
        y: 194,
      },
    ],
  },
  {
    id: "Online",
    data: [
      {
        x: "Vegetables",
        y: 74,
      },
      {
        x: "Fruits",
        y: 159,
      },
      {
        x: "Meat",
        y: 174,
      },
    ],
  },
];
