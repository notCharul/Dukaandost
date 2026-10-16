
import { tool } from "@langchain/core/tools";
import db from "./db.js";

export const searchProduct = tool(
  (name) => {
    const rows = db
      .prepare("SELECT product_id, name, unit_price, stock_qty, gst_percent, expiry_date FROM products WHERE name LIKE ?")
      .all(`%${name}%`);
    return JSON.stringify(rows);
  },
  {
    name: "search_product",
    description: "Search products by name. Input: ONE short keyword like 'maggi' or 'sugar'. Always call this before billing. If several products match, ask the shopkeeper which one. If nothing is found, retry once with a shorter or different spelling.",
  }
);


// const get_customer_balance = tool(name) => {




// }

export const lowstockalert = tool(
  (input) => {

    const threshold = Number(input) || 10;

    const rows = db

      .prepare("SELECT product_id , name , stock_qty FROM products WHERE stock_qty < ? ORDER BY stock_qty")
      .all(threshold)
    return JSON.stringify({ threshold, products: rows })
  },
  {
    name: "low_stock_alert",
    description: "Lists products whose stock is below a threshold, lowest first. Input: a number, e.g. '10'. If the user gives no number, pass '10'."
  }
);


export const expiringSoon = tool(
  (input) => {
    const days = Number(input) || 7;      
    const rows = db
      .prepare(`
        SELECT name, stock_qty, expiry_date,
               CASE WHEN expiry_date < date('now', 'localtime') THEN 'EXPIRED' ELSE 'expiring soon' END AS status
        FROM products
        WHERE expiry_date IS NOT NULL
          AND expiry_date <= date('now', 'localtime', ?)
        ORDER BY expiry_date
      `)
      .all(`+${days} days`);
    return JSON.stringify({ days, products: rows });
  },
  {
    name: "expiring_soon",
    description: "Lists products that are already expired or will expire within the next N days. Input: a number of days, e.g. '7' for this week. If the user gives no number pass '7'.",
  }
);

