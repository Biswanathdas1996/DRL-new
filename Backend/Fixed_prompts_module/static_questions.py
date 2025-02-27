import re
from datetime import datetime

def generate_static_sql(query_text: str) -> str:
    # Extract location, brand, and date range
    location_match = re.search(r'(?i)hq\s+(\w+)', query_text)
    brand_match = re.search(r'(?i)brand\s+(\w+)', query_text)
    date_range_match = re.findall(r'\d{4}-\d{2}-\d{2}', query_text)
    
    # Extract HQ IDs
    hq_ids_match = re.search(r'(?i)HQ\)\s+id\s+IN\s+\(([\d,\s]+)\)', query_text)
    
    location = location_match.group(1) if location_match else ""
    brand = brand_match.group(1) if brand_match else ""
    if len(date_range_match) == 2:
        start_date, end_date = date_range_match
    else:
        start_date, end_date = "", ""
    
    # Convert dates to DD-MM-YYYY format
    if start_date and end_date:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").strftime("%d-%m-%Y")
        end_date = datetime.strptime(end_date, "%Y-%m-%d").strftime("%d-%m-%Y")
    
    hq_ids = hq_ids_match.group(1).split(',') if hq_ids_match else []
    hq_ids = [hq.strip() for hq in hq_ids]
    
    # Generate SQL query
    # Get the first date of the current month
    first_date_of_current_month = datetime.now().replace(day=1).strftime("%d-%m-%Y")
    
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
        AND sa.TRANSACTION_DATE >= '{datetime.strptime(first_date_of_current_month, "%d-%m-%Y").strftime("%Y-%m-%d")}'
        AND sa.TRANSACTION_DATE < '{datetime.now().strftime("%Y-%m-%d")}'
        AND LOWER(b.Name) = LOWER('{brand}')
        AND sa.primary_sales > 0
    )
    ORDER BY s.Name;
    '''
    
    return sql_query.strip()

def generate_custom_sql_for_static_zero_billing(query_text: str) -> str:
    # Extract HQ IDs
    hq_ids_match = re.search(r'(?i)HQ\)\s+id\s+IN\s+\(([\d,\s]+)\)', query_text)
    hq_ids = hq_ids_match.group(1).split(',') if hq_ids_match else []
    hq_ids = [hq.strip() for hq in hq_ids]
    
    # Extract date range
    start_date = datetime.now().replace(day=1).strftime("%Y-%m-%d")
    end_date = datetime.now().strftime("%Y-%m-%d")
    
    # Convert dates to YYYY-MM-DD format
    if start_date and end_date:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").strftime("%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d").strftime("%Y-%m-%d")
    
    sql_query = f'''
    SELECT
        s.Name AS StockistName,
        0 AS Billing
    FROM
        Stockist s
        JOIN StockistHQMap shm ON s.ID = shm.Stockist_ID
        JOIN HQ h ON shm.HQ_ID = h.ID
    WHERE
        s.Name IS NOT NULL
        AND s.Name <> 'unknown'
        AND s.Name <> ' '
        AND NOT EXISTS (
            SELECT
                1
            FROM
                Sales sa
                JOIN BrandSKUMap bs ON sa.SKU_CODE = bs.SKU_Code
                JOIN Brand b ON bs.Brand_ID = b.ID
            WHERE
                sa.Stockist_ID = s.ID
                AND sa.hq_id IN ({', '.join(f"'{hq}'" for hq in hq_ids)})
                {f"AND sa.TRANSACTION_DATE >= '{start_date}'" if start_date else ''}
                {f"AND sa.TRANSACTION_DATE < '{end_date}'" if end_date else ''}
                AND sa.primary_sales > 0
        )
    ORDER BY
        s.Name;
    '''
    
    return sql_query.strip()
