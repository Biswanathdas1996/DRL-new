const monthNames: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function replaceLastMonths(str: string): string {
  // Array of month names

  // Extract the number of months from the string using regex
  const match = str.match(/last (\d+) months?/i);

  if (!match) {
    return str; // Return the original string if no match is found
  }

  // Get the number of months (n) from the matched string
  const n = parseInt(match[1], 10);

  // Get the current date
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-based month (0 = January, 11 = December)
  const currentYear = currentDate.getFullYear();

  // Generate the last n months' names along with their years, ignoring the current month
  let months: string[] = [];
  for (let i = 1; i <= n; i++) {
    // Start from 1 to ignore the current month
    let monthIndex = (currentMonth - i + 12) % 12; // Wrap around for negative index
    let yearAdjustment = currentMonth - i < 0 ? -1 : 0; // Adjust year if the month goes before January
    let year = currentYear + yearAdjustment;
    months.push(`${monthNames[monthIndex]} ${year}`);
  }

  // Replace the last 'n months' placeholder with actual month names and years
  let updatedStr = str.replace(/last \d+ months?/i, `${months.join(", ")}`);

  return updatedStr;
}

function replaceCurrentMonth(str: string): string {
  // Get the current date
  const currentDate = new Date();
  const currentMonthName = monthNames[currentDate.getMonth()]; // Get the current month name
  const currentYear = currentDate.getFullYear(); // Get the current year

  // Replace the term 'current month' with the current month name and year, case insensitive
  const updatedStr = str.replace(
    /current month/i,
    `${currentMonthName} ${currentYear}`
  );

  return updatedStr;
}

function replaceLastMonth(str: string): string {
  // Get the current date
  const currentDate = new Date();
  const lastMonthIndex = (currentDate.getMonth() - 1 + 12) % 12; // Get the last month index, wrap around for negative index
  const lastMonthYear =
    currentDate.getMonth() === 0
      ? currentDate.getFullYear() - 1
      : currentDate.getFullYear(); // Adjust year if the last month is December of the previous year
  const lastMonthName = monthNames[lastMonthIndex]; // Get the last month name

  // Replace the term 'last month' with the last month name and year, case insensitive
  const updatedStr = str.replace(
    /last month/i,
    `${lastMonthName} ${lastMonthYear}`
  );

  return updatedStr;
}

const dateConverter = (str: string): string => {
  let updatedStr = replaceLastMonths(str);
  updatedStr = replaceCurrentMonth(updatedStr);
  updatedStr = replaceLastMonth(updatedStr);

  return updatedStr;
};

export default dateConverter;
