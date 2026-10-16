# Test Prompts: DukaanDost (T6)

**Note:** Only 3 tools are connected to the agent: `search_product`, `low_stock_alert` and `expiring_soon`. The replies below are the agent's actual output, copied without editing.

## search_product

### 1. Do you have maggi?
**Tool used:** `search_product`
**What this shows:** several products match, so the agent should list them and ask which one.
**Reply:**
You: DO you have maggi?
ai response----> We have two Maggi items in stock:
1. **Maggi Masala Noodles 70 g** – ₹14 each, 120 pcs in stock.  
2. **Maggi 2‑Minute Atta Noodles 72 g** – ₹16 each, 60 pcs in stock.


### 2. Show me sugar
**Tool used:** `search_product`
**What this shows:** a single match with price and stock.
**Reply:**
You: Show me sugar
ai response----> We have **Sugar 1 kg** available at ₹46 per kg, with 80 kg in stock. Let me know if you’d like to add it to the bill.

### 3. Do you have chocolate?
**Tool used:** `search_product`
**What this shows:** a product that is not in the database, so the agent should say nothing was found.
**Reply:**
You: Do you have chocolate?
ai response----> We don’t have any chocolate in stock at the moment. Let me know if you’d like to check any other item.



## low_stock_alert

### 4. Which products are low on stock?
**Tool used:** `low_stock_alert`
**What this shows:** the default threshold of 10, lowest stock first.
**Reply:**
You: Which products are low on stock?
ai response----> **Low‑stock items (≤ 10 units)**  
- Colgate Strong Teeth 100 g – 3 pcs  
- Kurkure Masala Munch 90 g – 4 pcs  
- Dettol Handwash 200 ml – 5 pcs  
- Amul Kool Café 200 ml – 6 pcs  
- Moong Dal 1 kg – 6 pcs  
- Tata Tea Gold 250 g – 6 pcs  
- Surf Excel Easy Wash 1 kg – 7 pcs  
- Britannia Marie Gold 120 g – 8 pcs  

### 5. Show products with less than 5 stock
**Tool used:** `low_stock_alert`
**What this shows:** a custom threshold.
**Reply:**
You:  Show products with less than 5 stock
ai response----> **Products with ≤ 5 units in stock**
- Colgate Strong Teeth 100 g – 3 pcs  
- Kurkure Masala Munch 90 g – 4 pcs  




## expiring_soon

### 6. Which items will expire this week? (mandatory prompt #4)
**Tool used:** `expiring_soon`
**What this shows:** products expiring in the next 7 days, plus already expired ones marked EXPIRED.
**Reply:**
You: Which items will expire this week?
ai response----> **Items expiring this week (next 7 days)**  
| Product | Qty | Expiry date | Status |
|---|---|---|---|
| Amul Kool Cafe 200 ml | 6 | 2026‑10‑11 | EXPIRED |
| Amul Lassi 200 ml | 10 | 2026‑10‑14 | EXPIRED |
| Mother Dairy Toned Milk 1 L | 20 | 2026‑10‑17 | expiring soon |
| Amul Taaza Milk 500 ml | 40 | 2026‑10‑18 | expiring soon |
| Britannia Bread 400 g | 15 | 2026‑10‑19 | expiring soon |
| Amul Masti Dahi 400 g | 18 | 2026‑10‑20 | expiring soon |
| Amul Paneer 200 g | 12 | 2026‑10‑22 | expiring soon |
Let me know if you want to discount, remove, or reorder any of these.


### 7. Is Amul Lassi still okay to sell?
**Tools used:** `search_product` and/or `expiring_soon`
**What this shows:** an already expired product is identified as expired.
**Reply:**
You: Is Amul Lassi still okay to sell
ai response----> No – the **Amul Lassi 200 ml** batch expired on 2026‑10‑14, so it should be taken out of sale (or discarded). Let me know if you’d like to remove it from the inventory or need anything else.



## Agent introduction

### 8. Who are you?
**What this shows:** the agent introduces itself as DukaanDost.
**Reply:**
You: Who are you
ai response----> I’m DukaanDost – your kirana‑store assistant. I help you with billing, stock checks, expiry alerts and the udhaar ledger. Let me know what you need!



## Mandatory prompts not covered
These 4 mandatory prompts need tools that are not connected yet, so they are not tested:

- Bill for Sharma ji: 2 Maggi, 1 kg sugar, 1 Amul butter - put it on udhaar. (needs `create_bill`)
- How much does Sharma ji owe me? (needs `get_customer_balance`)
- Sharma ji paid 500 cash today. (needs `record_credit_payment`)
- What were my top 5 selling items this month? (needs `top_selling_products`)

## Business rule violation
No billing rule (stock limit, credit limit, expired sale) is tested because `create_bill` is not connected. The expired-product check is only visible in the `expiring_soon` output, which marks expired items as EXPIRED.