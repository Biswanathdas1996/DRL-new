interface Section {
  title: string;
  subsections: {
    title: string;
    query: string;
  }[];
}

export const data: Section[] = [
  {
    title: "1. Top Performing HQs, Stockists, Brands, and SKUs",
    subsections: [
      {
        title: "Top 20 HQs by Units Sold",
        query: `SELECT hq.name, SUM(s.primary_units) AS total_units_sold
FROM Sales s
JOIN HQ hq ON s.hq_id = hq.id
WHERE s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY hq.name
ORDER BY total_units_sold DESC
LIMIT 20;`,
      },
      {
        title: "Top Stockists by Units Sold",
        query: `SELECT st.name, SUM(s.primary_units) AS total_units_sold
FROM Sales s
JOIN Stockist st ON s.stockist_id = st.id
WHERE s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY st.name
ORDER BY total_units_sold DESC
LIMIT 20;`,
      },
      {
        title: "Top Brands by Units Sold",
        query: `SELECT b.name, SUM(s.primary_units) AS total_units_sold
FROM Sales s
JOIN BrandSKUMap bsm ON s.sku_code = bsm.sku_code
JOIN Brand b ON bsm.brand_id = b.id
WHERE s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY b.name
ORDER BY total_units_sold DESC
LIMIT 20;`,
      },
      {
        title: "Top SKUs by Units Sold",
        query: `SELECT sk.name, SUM(s.primary_units) AS total_units_sold
FROM Sales s
JOIN SKU sk ON s.sku_code = sk.code
WHERE s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY sk.name
ORDER BY total_units_sold DESC
LIMIT 20;`,
      },
    ],
  },
  {
    title: "2. Least Performing HQs, Stockists, Brands, and SKUs",
    subsections: [
      {
        title: "Bottom HQs by Units Sold",
        query: `SELECT hq.name, COALESCE(SUM(s.primary_units), 0) AS total_units_sold
FROM HQ hq
LEFT JOIN Sales s ON s.hq_id = hq.id AND s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY hq.name
ORDER BY total_units_sold ASC
LIMIT 20;`,
      },
      {
        title: "Bottom Stockists by Units Sold",
        query: `SELECT st.name, COALESCE(SUM(s.primary_units), 0) AS total_units_sold
FROM Stockist st
LEFT JOIN Sales s ON s.stockist_id = st.id AND s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY st.name
ORDER BY total_units_sold ASC
LIMIT 20;`,
      },
      {
        title: "Bottom Brands by Units Sold",
        query: `SELECT b.name, COALESCE(SUM(s.primary_units), 0) AS total_units_sold
FROM Brand b
LEFT JOIN BrandSKUMap bsm ON b.id = bsm.brand_id
LEFT JOIN Sales s ON s.sku_code = bsm.sku_code AND s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY b.name
ORDER BY total_units_sold ASC
LIMIT 20;`,
      },
      {
        title: "Bottom SKUs by Units Sold",
        query: `SELECT sk.name, COALESCE(SUM(s.primary_units), 0) AS total_units_sold
FROM SKU sk
LEFT JOIN Sales s ON sk.code = s.sku_code AND s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY sk.name
ORDER BY total_units_sold ASC
LIMIT 20;`,
      },
    ],
  },
  {
    title: "3. Identifying HQs, Brands, and SKUs Contributing Less to Turnover",
    subsections: [
      {
        title: "HQs Less than 5% of Total Units Sold",
        query: `WITH TotalSales AS (
                                SELECT SUM(primary_units) AS total_units FROM Sales WHERE transaction_date BETWEEN ':start_date' AND ':end_date'
)
SELECT hq.name, COALESCE(SUM(s.primary_units), 0) AS total_units_sold,
                                                 (COALESCE(SUM(s.primary_units), 0) / (SELECT total_units FROM TotalSales) * 100) AS contribution_percentage
FROM HQ hq
LEFT JOIN Sales s ON s.hq_id = hq.id AND s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY hq.name
HAVING (COALESCE(SUM(s.primary_units), 0) / (SELECT total_units FROM TotalSales) * 100) < 5
ORDER BY contribution_percentage ASC
LIMIT 60
;`,
      },
    ],
  },
  {
    title: "4. SKUs and Brands That Need More Production",
    subsections: [
      {
        title: "SKUs Where Demand Exceeds Supply",
        query: `SELECT 
    SK.NAME,
    COALESCE(SUM(T.TARGET_UNITS), 0) AS TARGET_DEMAND,
    COALESCE(SUM(S.PRIMARY_UNITS), 0) AS ACTUAL_SALES,
    (COALESCE(SUM(T.TARGET_UNITS), 0) - COALESCE(SUM(S.PRIMARY_UNITS), 0)) AS DEMAND_GAP
FROM SKU SK
LEFT JOIN SALES S 
    ON SK.CODE = S.SKU_CODE 
    AND S.TRANSACTION_DATE BETWEEN ':start_date' AND ':end_date'
LEFT JOIN TARGET T 
    ON SK.CODE = T.SKU_CODE
    AND T.TARGET_DATE BETWEEN ':start_date' AND ':end_date'
GROUP BY SK.NAME
HAVING (COALESCE(SUM(T.TARGET_UNITS), 0) - COALESCE(SUM(S.PRIMARY_UNITS), 0)) > 0
ORDER BY DEMAND_GAP DESC;`,
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
                                                 SUM(s.primary_units) AS total_units_sold
FROM Sales s
JOIN HQ hq ON s.hq_id = hq.id
JOIN SKU sk ON s.sku_code = sk.code
WHERE s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY hq.name, sk.name, sales_month
ORDER BY sales_month DESC, total_units_sold DESC;`,
      },
      {
        title: "Which SKUs Sold the Most During a Specific Month",
        query: `SELECT sk.name, SUM(s.primary_units) AS total_units_sold
FROM Sales s
JOIN SKU sk ON s.sku_code = sk.code
WHERE s.transaction_date BETWEEN ':start_date' AND ':end_date'
GROUP BY sk.name
ORDER BY total_units_sold DESC
LIMIT 10;`,
      },
    ],
  },
  {
    title: "6. Inventory Management",
    subsections: [
      {
        title: "SKU-wise sales, target, and an estimated profitability metric:",
        query: `WITH sales_summary AS (
    SELECT 
        s.sku_code, 
        sk.name AS sku_name,
        SUM(s.primary_sales) AS total_sales_value,
        SUM(s.primary_units) AS total_units_sold,
        t.target_value AS target_sales_value,
        t.target_units AS target_units,
        (SUM(s.primary_sales) - t.target_value) AS profit_estimate
    FROM sales s
    JOIN sku sk ON s.sku_code = sk.code
    LEFT JOIN target t ON s.sku_code = t.sku_code 
                        AND t.target_date BETWEEN ':start_date' AND ':end_date'
    WHERE s.transaction_date BETWEEN ':start_date' AND ':end_date'
    GROUP BY s.sku_code, sk.name, t.target_value, t.target_units
)
SELECT 
    sku_code, 
    sku_name,
    total_sales_value,
    total_units_sold,
    target_sales_value,
    target_units,
    profit_estimate,
    CASE 
        WHEN profit_estimate > 0 THEN 'Profitable'
        ELSE 'Needs Attention'
    END AS status
FROM sales_summary
ORDER BY profit_estimate DESC;
`,
      },
    ],
  },
];
