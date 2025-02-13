import re

def generate_static_sql(query_text: str) -> str:
    # Extract location, brand, and date range
    location_match = re.search(r'(?i)hq\s+(\w+)', query_text)
    brand_match = re.search(r'(?i)brand\s+(\w+)', query_text)
    date_range_match = re.findall(r'\d{4}-\d{2}-\d{2}', query_text)
    
    # Extract HQ IDs
    hq_ids_match = re.search(r'(?i)HQ\)\s+id\s+IN\s+\(([\d,\s]+)\)', query_text)
    
    location = location_match.group(1) if location_match else ""
    brand = brand_match.group(1) if brand_match else ""
    start_date, end_date = date_range_match if len(date_range_match) == 2 else ("", "")
    
    hq_ids = hq_ids_match.group(1).split(',') if hq_ids_match else []
    hq_ids = [hq.strip() for hq in hq_ids]
    
    # Generate SQL query
    sql_query = f'''
    SELECT s.Name AS StockistName
    FROM Stockist s
    JOIN StockistHQMap shm ON s.ID = shm.Stockist_ID
    JOIN HQ h ON shm.HQ_ID = h.ID
    WHERE LOWER(h.Name) LIKE LOWER('%{location}%')
    AND s.Name IS NOT NULL
    AND s.Name <> 'unknown'
    AND NOT EXISTS (
        SELECT 1 
        FROM Sales sa
        JOIN BrandSKUMap bs ON sa.SKU_CODE = bs.SKU_Code
        JOIN Brand b ON bs.Brand_ID = b.ID
        WHERE sa.Stockist_ID = s.ID
        AND sa.hq_id IN ({', '.join(f"'{hq}'" for hq in hq_ids)})
        AND sa.TRANSACTION_DATE >= '{start_date}'
        AND sa.TRANSACTION_DATE < '{end_date}'
        AND LOWER(b.Name) = LOWER('{brand}')
        AND sa.primary_sales > 0
    )
    ORDER BY s.Name;
    '''
    
    return sql_query.strip()

# # # Example usage
# query_text = "Which strockist have zero billing for brand Cheeriofor hq Kolkata for 2024-12-01 to 2025-01-01 WHERE Head Quarters (HQ) id IN (50058715,50058741,50173634,50178275),Make all hq_id as String"
# print(generate_sql(query_text))