# DukaanDost: Kirana Store Inventory & Billing Agent

- **Task code:** T6
- **Agent name:** DukaanDost
- **Built by:** Charul, ICFAI Dehradun

## About
DukaanDost is a chat assistant for a kirana store owner. It answers questions about products, stock and expiry by reading a real SQLite database.

## Project status (please read)
**Only 3 of the 8 required tools are connected to the agent:**
I will add them in FUTURE for Sure..

| Tool | What it does | Status |
|------|--------------|--------|
| `search_product` | Finds products by name (partial match), with price and stock | Done |
| `low_stock_alert` | Lists products below a stock threshold | Done |
| `expiring_soon` | Lists products expired or expiring in the next N days | Done |
| `create_bill` | Bill with GST, stock deduction, credit limit check | Not added |
| `update_stock` | Add stock to a product | Not added |
| `record_credit_payment` | Record a customer's udhaar payment | Not added |
| `get_customer_balance` | Show outstanding credit and history | Not added |
| `top_selling_products` | Top N products by quantity sold | Not added |

The database already has the tables for billing and the udhaar ledger. I ran out of time to build the remaining tools.

## How this project was made
- **`schema.sql`:** written by me.
- **`tools.js` and `indexx.js`:** written by me. I was not familiar with JavaScript, so I used online tutorials and documentation to learn how to connect to a database (`better-sqlite3`) and how to build an agent (LangChain).
- **`seed.js`:** generated with the help of AI to create realistic random sample data (51 products, 10 customers, 15 bills, ledger entries).
- I also used an AI assistant for guidance on project structure and Git setup.

## Tech stack
Node.js, SQLite (`better-sqlite3`), LangChain, Groq (`openai/gpt-oss-120b`)

## Setup
1. Install Node.js (v18 or newer).
2. Install packages:
```
npm install better-sqlite3 langchain @langchain/core @langchain/groq @langchain/langgraph dotenv
```
3. Copy `.env.example` to `.env` and add your Groq API key:
```
   GROQ_API_KEY=your_key_here
```
4. Create the sample data (safe to run again):
```
   node seed.js
```
5. Start the chat:
```
   node indexx.js
```
   Type `bye` to exit.

## Safe queries
All tools use `?` placeholders (parameterised queries). User text is never joined into SQL strings. The AI cannot run free-form write queries.


## Known limitations
- Billing, credit payments, stock updates, customer balance and top-selling reports are not available in the agent yet.
- Only a CLI chat is available (no web UI).
- Session memory works only while the program is running.


## Acknowledgements
Also I would like to Thank Amit sir for this amazing knowledge he shared with us.
I was already familiar with Ai api calling in python since it was js it was new for me.
I would love to continue with your session and get the amazing knowledge from you. 
Thanks you sir !
