import React from "react";

const data = {
  title: "Prompting Guidelines",
  sections: [
    {
      title: "1.General Guidelines",
      content: [
        "Use clear and concise natural language queries.",
        "Specify relevant attributes when necessary.",
        "If requesting filtered data, mention the conditions explicitly.",
        "Use date-specific queries carefully, ensuring a valid format (YYYY-MM-DD).",
        "Include required aggregations (sum, count, average) where applicable.",
        "Avoid vague queries like 'Get me the data'; be specific about what you need.",
        "Structure queries logically to improve readability and execution.",
        "Limit data retrieval by using appropriate WHERE clauses.",
        "Ensure queries adhere to schema constraints and relationships.",
        "Specify sorting orders when necessary, using ORDER BY.",
        "Use GROUP BY for aggregated results when dealing with summarized data.",
        "Avoid unnecessary subqueries that may impact performance.",
        "Ensure queries return meaningful insights relevant to the business requirements.",
      ],
    },
    {
      title: "2.Query Types & Examples",
      subsections: [
        {
          title: "2.a) Retrieving Basic Data",
          description:
            "Retrieving basic data involves fetching records from tables without complex conditions. These queries help users explore available data and understand the structure of data.",
          examples: [
            "Show me all SKUs.",
            "List all brands and their categories.",
            "Get all users.",
            "Retrieve all HQ names.",
            "Show all stockists and their IDs.",
            "List all available divisions.",
            "Fetch all sales transactions.",
            "Retrieve all brand names with their IDs.",
            "Get all role names from the Role table.",
            "Show all stockist names.",
          ],
        },
        {
          title: "2.b) Filtering Data",
          description:
            "Filtering data allows users to narrow down query results based on specific conditions. Applying filters helps in retrieving only relevant records, reducing unnecessary data processing.",
          examples: [
            "Get all sales transactions where primary sales is greater than 5000.",
            "Show all stockists in HQ name Kolkata.",
            "Retrieve all users who have login enabled.",
            "Fetch all transactions where status is 'Completed'.",
            "Get all targets where target value is between 1000 and 5000.",
            "List all stockists associated with Division 'D001'.",
            "Show all SKUs that belong to Brand ID 10.",
            "Get all employees who belong to Role ID 3.",
            "Retrieve all sales records for SKU 'ABC123' in HQ 'HQ001'.",
          ],
        },
        {
          title: "2.b) Aggregation Queries",
          description:
            "Aggregation queries are used to calculate summary statistics like SUM, COUNT, AVG, MAX, and MIN. These queries provide valuable insights by grouping data based on specific criteria.",
          examples: [
            "What is the total sales for January 2024?",
            "Get the average target value per division.",
            "Find the highest sales transaction amount.",
            "Calculate the total number of stockists per HQ.",
            "Show the sum of primary units sold per SKU.",
            "Get the average sales value per stockist.",
            "Find the total sales grouped by brand.",
            "Retrieve the minimum target value recorded.",
            "Get the total sales volume per billing type.",
          ],
        },
        {
          title: "2.c) Time-based Queries",
          description:
            "Time-based queries help retrieve data within a specified date or time range. These queries are useful for trend analysis, performance tracking, and historical comparisons.",
          examples: [
            "Get all sales records for the last 6 months.",
            "Show me target values between 2023-01-01 and 2023-12-31.",
            "Retrieve all transactions from the previous quarter.",
            "Fetch sales performance data for the current fiscal year.",
            "Show monthly revenue trends for the last 12 months.",
            "List the weekly sales breakdown for SKU 'XYZ'.",
            "Get all target records updated in the last 7 days.",
            "Find sales transactions for weekends only.",
            "Fetch quarterly target achievements.",
            "Get all sales records grouped by year.",
          ],
        },
        {
          title: "2.d) User and Role Queries",
          description:
            "User and role queries focus on retrieving user-related data, including roles, permissions, and assigned responsibilities. These queries help in access management and organizational reporting.",
          examples: [
            "List all users with their roles.",
            "Show all managers and their assigned users.",
            "Find users who belong to Role ID 5.",
            "Retrieve login-enabled users with their HQs.",
            "Fetch all employees assigned to multiple roles.",
            "List users along with their reporting managers.",
            "Show user details including their assigned division.",
            "Get the total count of users per role.",
            "Find inactive users who haven't logged in for 6 months.",
            "Retrieve the role names of all employees in HQ 'HQ001'.",
          ],
        },
        {
          title: "2.e) Performance Queries",
          description:
            "Performance queries are designed to analyse business efficiency by comparing sales, targets, and other key metrics. They help identify trends, outliers, and areas for improvement.",
          examples: [
            "What is the sales achievement percentage for each HQ?",
            "Compare primary sales vs target values for SKU 'ABC123'.",
            "Find the top 5 performing stockists by sales volume.",
            "Show the percentage increase in sales compared to last year.",
            "Retrieve sales data where target achievement is below 80%.",
            "List HQs ranked by highest revenue.",
            "Fetch the stockist with the highest return percentage.",
            "Compare division-wise sales growth over the past 3 years.",
            "Get SKU-wise contribution to total revenue.",
            "Find underperforming regions based on target achievements.",
          ],
        },
        {
          title: "2.f) Historical Data Queries",
          description:
            "Historical data queries allow users to retrieve past records for analysis and reporting. They are essential for long-term trend analysis and decision-making based on historical performance.",
          examples: [
            "Fetch sales data from the last 3 years.",
            "Find historical stock levels of SKU 'XYZ'.",
            "Show revenue trends over the last decade.",
            "List annual sales data for each brand.",
            "Get the number of transactions per month since 2020.",
            "Retrieve stockist sales records for the last 5 years.",
            "Fetch historical employee login records.",
            "Compare sales performance from 2018 to 2023.",
            "Show division-wise revenue breakdown since inception.",
          ],
        },
        {
          title: "2.g) Joining Tables for Related Information",
          examples: [
            "Show me all stockists and their HQ names.",
            "List SKUs along with their corresponding brand names.",
          ],
        },
      ],
    },
    {
      title: "3) Special Considerations",
      content: [
        "Ensure case sensitivity when filtering by text values.",
        "Validate input dates to avoid incorrect results.",
        "Use indexes to optimize large table queries.",
        "Limit results for better performance in large datasets.",
        "Use joins appropriately when querying multiple tables.",
        "Avoid fetching unnecessary columns to reduce load time.",
        "Check for NULL values in key fields before filtering.",
        "Convert string-based date fields into proper date formats.",
        "Use DISTINCT where necessary to avoid duplicate records.",
        "Ensure that primary keys are referenced correctly in queries.",
      ],
    },
    {
      title: "4) Common Mistakes to Avoid",
      content: [
        "Using generic terms like 'get data' without specifying details.",
        "Not providing a date range when querying large datasets.",
        "Using ambiguous column names that exist in multiple tables.",
        "Forgetting to include required filters, such as HQ ID or SKU Code.",
        "Requesting too much data at once, leading to performance issues.",
        "Using incorrect date formats.",
        "Ignoring necessary joins when querying multiple tables.",
        "Asking for 'all records' instead of setting limits.",
        "Confusing similar column names, like id in multiple tables.",
        "Not specifying grouping when using aggregate functions.",
      ],
    },
    {
      title: "5) Best Practices",
      content: [
        "Use clear and structured queries with proper keywords.",
        "Always specify the table or relevant columns in queries.",
        "Use proper filtering conditions to get precise results.",
        "Set date ranges explicitly when querying time-based data.",
        "Use aggregate functions appropriately with groupings.",
        "Keep queries concise and focused on the required data.",
        "Ensure accurate joins when combining multiple tables.",
        "Limit large queries to avoid performance slowdowns.",
        "Use clear column aliases when needed for readability.",
        "Validate input values before executing queries.",
      ],
    },

    {
      title: "6) Best Phrases for Queries",
      content: [
        "List all SKUs along with their brand names.",
        "Show total sales for each HQ in the last quarter.",
        "Retrieve all users who have login enabled.",
        "Get primary sales and target values for SKU 'XYZ' in HQ 'HQ001'.",
        "Find top-performing stockists by revenue.",
        "Fetch sales data for the last 12 months grouped by month.",
        "Show me the percentage of sales returns per region.",
        "Retrieve all employee roles along with their assigned divisions.",
        "Find the highest and lowest sales transaction values.",
        "Compare sales achievement percentages across all divisions.",
      ],
    },
    {
      title: "7) Mistakes",
      content: [
        "❌ 'Give me all data' → ✅ 'List all sales transactions for January 2024'",
        "❌ 'Show users' → ✅ 'Show all users with their roles and HQ IDs'",
        "❌ 'Get sales' → ✅ 'Fetch primary_sales and target_value for SKU 'XYZ' in HQ 'HQ001''",
        "❌ 'List stockists' → ✅ 'Show stockist names along with their HQ assignments'",
        "❌ 'Retrieve targets' → ✅ 'Get target_value and target_units for Division 'D001' in Q1 2024'",
        "❌ 'Sales of SKU ABC' → ✅ 'Fetch primary_sales and primary_units for SKU 'ABC' in the last quarter'",
        "❌ 'Find user queries' → ✅ 'Show all user queries from ConversationLog in the last 30 days'",
      ],
    },
  ],
};
const Documentation: React.FC = () => {
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
    </div>
  );
};

export default Documentation;
