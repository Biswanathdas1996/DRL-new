export const dbSchema = `
1. **sales** (id, transaction_date, primary_sales, primary_units, sku_code, division_code, stockist_id, hq_id)
            - 🔗 sku_code → sku.code
            - 🔗 division_code → division.code
            - 🔗 stockist_id → stockist.id
            - 🔗 hq_id → hq.id

            2. **target** (id, target_date, target_units, target_value, sku_code, division_code, hq_id)
            - 🔗 sku_code → sku.code
            - 🔗 division_code → division.code
            - 🔗 hq_id → hq.id

            3. **sku** (code, name)

            4. **brand** (id, name, category)
            - 🔗 brandskumap.brand_id → brand.id
            - 🔗 brandskumap.sku_code → sku.code

            5. **brandskumap** (brand_id, sku_code)
            - Links brands to SKUs.

            6. **hq** (id, name)  
            - Headquarters of operations.

            7. **stockist** (id, name)  
            - Distributors linked to sales.

            8. **division** (code, name)  

            9. **usermanagermap** (id, userid, managerid)
            - 🔗 userid → userdetails.id
            - 🔗 managerid → userdetails.id

            10. **userdetails** (id, name, roleid, hq_id, loginenabled, emp_code)
                - 🔗 roleid → role.id
                - 🔗 hq_id → hq.id

            11. **role** (id, name)  
                - Defines user roles.

            12. **conversation_log** (id, timestamp, user_id, userquery, sqlquery)  
                - Stores AI-generated queries.
                    \n`;
