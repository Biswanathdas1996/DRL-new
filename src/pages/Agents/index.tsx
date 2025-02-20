import React from "react";

interface Section {
  title: string;
  subsections: Subsection[];
}

interface Subsection {
  title: string;
  query: string;
}

const data: Section[] = [
  {
    title: "1. Top Performing HQs, Stockists, Brands, and SKUs",
    subsections: [
      {
        title: "Top 5 HQs by Sales Value",
        query: `SELECT hq.name, SUM(s.primary_sales) AS total_sales
FROM Sales s
JOIN HQ hq ON s.hq_id = hq.id
GROUP BY hq.name
ORDER BY total_sales DESC
LIMIT 5;`,
      },
      {
        title: "Top 5 Stockists by Sales Value",
        query: `SELECT st.name, SUM(s.primary_sales) AS total_sales
FROM Sales s
JOIN Stockist st ON s.stockist_id = st.id
GROUP BY st.name
ORDER BY total_sales DESC
LIMIT 5;`,
      },
      {
        title: "Top 5 Brands by Sales",
        query: `SELECT b.name, SUM(s.primary_sales) AS total_sales
FROM Sales s
JOIN BrandSKUMap bsm ON s.sku_code = bsm.sku_code
JOIN Brand b ON bsm.brand_id = b.id
GROUP BY b.name
ORDER BY total_sales DESC
LIMIT 5;`,
      },
      {
        title: "Top 5 SKUs by Sales",
        query: `SELECT sk.name, SUM(s.primary_sales) AS total_sales
FROM Sales s
JOIN SKU sk ON s.sku_code = sk.code
GROUP BY sk.name
ORDER BY total_sales DESC
LIMIT 5;`,
      },
    ],
  },
  {
    title: "2. Least Performing HQs, Stockists, Brands, and SKUs",
    subsections: [
      {
        title: "Bottom 5 HQs by Sales Value",
        query: `SELECT hq.name, COALESCE(SUM(s.primary_sales), 0) AS total_sales
FROM HQ hq
LEFT JOIN Sales s ON s.hq_id = hq.id
GROUP BY hq.name
ORDER BY total_sales ASC
LIMIT 5;`,
      },
      {
        title: "Bottom 5 Stockists by Sales Value",
        query: `SELECT st.name, COALESCE(SUM(s.primary_sales), 0) AS total_sales
FROM Stockist st
LEFT JOIN Sales s ON s.stockist_id = st.id
GROUP BY st.name
ORDER BY total_sales ASC
LIMIT 5;`,
      },
      {
        title: "Bottom 5 Brands by Sales",
        query: `SELECT b.name, COALESCE(SUM(s.primary_sales), 0) AS total_sales
FROM Brand b
LEFT JOIN BrandSKUMap bsm ON b.id = bsm.brand_id
LEFT JOIN Sales s ON s.sku_code = bsm.sku_code
GROUP BY b.name
ORDER BY total_sales ASC
LIMIT 5;`,
      },
      {
        title: "Bottom 5 SKUs by Sales",
        query: `SELECT sk.name, COALESCE(SUM(s.primary_sales), 0) AS total_sales
FROM SKU sk
LEFT JOIN Sales s ON sk.code = s.sku_code
GROUP BY sk.name
ORDER BY total_sales ASC
LIMIT 5;`,
      },
    ],
  },
  {
    title: "3. Identifying HQs, Brands, and SKUs Contributing Less to Turnover",
    subsections: [
      {
        title: "HQs Contributing Less than 5% of Total Sales",
        query: `WITH TotalSales AS (
                SELECT SUM(primary_sales) AS total_sales FROM Sales
)
SELECT hq.name, COALESCE(SUM(s.primary_sales), 0) AS total_sales,
                         (COALESCE(SUM(s.primary_sales), 0) / (SELECT total_sales FROM TotalSales) * 100) AS contribution_percentage
FROM HQ hq
LEFT JOIN Sales s ON s.hq_id = hq.id
GROUP BY hq.name
HAVING (COALESCE(SUM(s.primary_sales), 0) / (SELECT total_sales FROM TotalSales) * 100) < 5
ORDER BY contribution_percentage ASC;`,
      },
    ],
  },
  {
    title: "4. SKUs and Brands That Need More Production",
    subsections: [
      {
        title: "SKUs Where Demand Exceeds Supply",
        query: `SELECT sk.name, 
                         COALESCE(SUM(t.target_units), 0) AS target_demand, 
                         COALESCE(SUM(s.primary_units), 0) AS actual_sales, 
                         (COALESCE(SUM(t.target_units), 0) - COALESCE(SUM(s.primary_units), 0)) AS demand_gap
FROM SKU sk
LEFT JOIN Sales s ON sk.code = s.sku_code
LEFT JOIN Target t ON sk.code = t.sku_code
GROUP BY sk.name
HAVING (COALESCE(SUM(t.target_units), 0) - COALESCE(SUM(s.primary_units), 0)) > 0
ORDER BY demand_gap DESC;`,
      },
    ],
  },
  {
    title:
      "5. Seasonal Analysis: Which HQs Should Focus on Which SKUs/Brands in Which Months",
    subsections: [
      {
        title: "Top Selling SKUs per HQ in Each Month",
        query: `SELECT hq.name AS hq_name, 
                         sk.name AS sku_name, 
                         DATE_TRUNC('month', s.transaction_date) AS sales_month,
                         SUM(s.primary_sales) AS total_sales
FROM Sales s
JOIN HQ hq ON s.hq_id = hq.id
JOIN SKU sk ON s.sku_code = sk.code
GROUP BY hq.name, sk.name, sales_month
ORDER BY sales_month DESC, total_sales DESC;`,
      },
      {
        title: "Which SKUs Sold the Most During a Specific Month",
        query: `SELECT sk.name, SUM(s.primary_sales) AS total_sales
FROM Sales s
JOIN SKU sk ON s.sku_code = sk.code
WHERE EXTRACT(MONTH FROM s.transaction_date) = <MONTH_NUMBER>
GROUP BY sk.name
ORDER BY total_sales DESC
LIMIT 10;`,
      },
      {
        title: "Forecasting Sales Trends for Next Month Based on Past Data",
        query: `SELECT sk.name, ROUND(AVG(s.primary_sales), 2) AS avg_monthly_sales
FROM Sales s
JOIN SKU sk ON s.sku_code = sk.code
WHERE s.transaction_date >= NOW() - INTERVAL '12 months'
GROUP BY sk.name
ORDER BY avg_monthly_sales DESC;`,
      },
    ],
  },
];
const AgentsPage: React.FC = () => {
  return (
    <div>
      <h1>SQL Queries Optimized for PostgreSQL Compatibility</h1>

      {data.map((section, sectionIndex) => (
        <section key={sectionIndex}>
          <h2>{section.title}</h2>
          {section.subsections.map((subsection, subsectionIndex) => (
            <div key={subsectionIndex}>
              <h3>{subsection.title}</h3>
              <pre>{subsection.query}</pre>
            </div>
          ))}
        </section>
      ))}

      <section>
        <h2>Conclusion</h2>
        <p>
          These queries will provide comprehensive insights into your business,
          helping in:
        </p>
        <ul>
          <li>
            Identifying high and low-performing HQs, stockists, brands, and
            SKUs.
          </li>
          <li>
            Understanding underperforming areas that might need to be
            discontinued.
          </li>
          <li>
            Determining which SKUs/brands need higher production based on
            demand.
          </li>
          <li>
            Predicting sales trends to optimize inventory and sales strategies.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AgentsPage;
