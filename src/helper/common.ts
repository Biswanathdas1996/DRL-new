export function extractJavascriptCode(str: string): string | null {
  const startMarker = "```javascript";
  const endMarker = "```";
  const startIndex = str.indexOf(startMarker);

  if (startIndex === -1) {
    return null; // Or throw an error, depending on desired behavior
  }

  const codeStartIndex = startIndex + startMarker.length;
  const endIndex = str.indexOf(endMarker, codeStartIndex);

  if (endIndex === -1) {
    return null; // Or throw an error
  }

  return str.substring(codeStartIndex, endIndex).trim();
}

export function generatePromptForChart(
  data: any,
  chartSpecificData: any,
  chartType: string,
  packageUsed: string
) {
  const prompt_template = `
Generate the optimal item combinations to construct a ${chartType} using ${packageUsed}.

Next, write a JavaScript function that accepts the following sample input:
Input: ${JSON.stringify(data.slice(0, 3))}

Return a JSON object formatted for ${chartType} using ${packageUsed}.
Expected Output Format: ${JSON.stringify(chartSpecificData)}

Requirements:

Use clear and descriptive pointers, legends, and labels.

The function must be scalable to handle large datasets.

Output must be directly usable with ${packageUsed}.

Only return the function code — no additional text.

Ensure efficiency, proper edge case handling, and strict adherence to the required structure.
        `;

  return prompt_template;
}
