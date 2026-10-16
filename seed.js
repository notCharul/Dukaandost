

// seed.js - fills the database with sample data for DukaanDost.
//
// Run it from the project folder:   node seed.js
// It is safe to run again: it clears the old sample data first.
//
// What it creates: 51 products, 10 customers, 15 bills (all in the CURRENT month),
// and the udhaar (credit) ledger entries that go with them.

import db from "./db.js";

// ============================================================
// Small helpers
// ============================================================

// All dates come from SQLite's own clock (in LOCAL time), the same clock your tools
// will use for "expiring soon" and "this month". Using one clock everywhere means
// the seed data and the queries can never disagree about what "today" is.
const dateAfter = db.prepare("SELECT date('now', 'localtime', ?) AS d");
const dateAfterClamped = db.prepare(
  "SELECT max(date('now', 'localtime', ?), date('now', 'localtime', 'start of month')) AS d"
);

// daysFromNow(3) = the date 3 days ahead, daysFromNow(-2) = 2 days ago.
// We use this so "expiring this week" works no matter when the judges run the seed.
function daysFromNow(n) {
  return dateAfter.get(`${n} days`).d;
}

// Date for a sample bill, "daysAgo" days back, but never earlier than the 1st of
// THIS month. That way "top 5 items this month" always has data to show.
function billDate(daysAgo) {
  return dateAfterClamped.get(`-${daysAgo} days`).d;
}

// Round money to 2 decimals (avoids things like 28.000000000000004)
const round2 = (n) => Math.round(n * 100) / 100;

// ============================================================
// The sample data (edit freely!)
// ============================================================

// [name, category, unit_price, stock_qty, gst_percent, expires in N days]
//   expires: a negative number = ALREADY EXPIRED, null = never expires.
// GST rates are sample values for the demo.
const products = [
  // --- Noodles (two Maggi products on purpose: "maggi" must make the agent ask which one)
  ["Maggi Masala Noodles 70g",        "Noodles",       14, 120, 12, 180],
  ["Maggi 2-Minute Atta Noodles 72g", "Noodles",       16,  60, 12, 150],
  ["Yippee Magic Masala Noodles 70g", "Noodles",       14,  45, 12, 170],
  ["Ching's Hakka Noodles 150g",      "Noodles",       40,  25, 12, 200],

  // --- Biscuits and snacks
  ["Parle-G Biscuit 100g",            "Snacks",        10, 150, 12, 120],
  ["Good Day Butter Cookies 75g",     "Snacks",        20,  60, 12, 100],
  ["Britannia Marie Gold 120g",       "Snacks",        25,   8, 12,  90],  // low stock
  ["Oreo Biscuit 120g",               "Snacks",        35,  40, 12, 110],
  ["Lays Classic Salted 52g",         "Snacks",        20,  50, 12,  75],
  ["Kurkure Masala Munch 90g",        "Snacks",        20,   4, 12,  60],  // low stock
  ["Haldiram Aloo Bhujia 200g",       "Snacks",        55,  30, 12, 130],
  ["Bingo Mad Angles 66g",            "Snacks",        20,  35, 12,  80],

  // --- Dairy and bakery (short shelf life: these drive "expiring soon")
  ["Amul Taaza Milk 500ml",           "Dairy",         30,  40,  0,   2],  // expires in 2 days
  ["Mother Dairy Toned Milk 1L",      "Dairy",         66,  20,  0,   1],  // expires tomorrow
  ["Amul Masti Dahi 400g",            "Dairy",         45,  18,  0,   4],  // expires in 4 days
  ["Amul Paneer 200g",                "Dairy",         85,  12,  0,   6],  // expires in 6 days
  ["Britannia Bread 400g",            "Bakery",        45,  15,  0,   3],  // expires in 3 days
  ["Amul Butter 100g",                "Dairy",         58,  22, 12,  25],
  ["Amul Cheese Slices 200g",         "Dairy",        130,  14, 12,  45],
  ["Eggs (6 pcs)",                    "Dairy",         48,  30,  0,  10],
  ["Amul Lassi 200ml",                "Dairy",         25,  10,  0,  -2],  // ALREADY EXPIRED
  ["Amul Kool Cafe 200ml",            "Dairy",         30,   6,  0,  -5],  // ALREADY EXPIRED

  // --- Staples
  ["Sugar 1kg",                       "Staples",       46,  80,  5, null],
  ["Aashirvaad Atta 5kg",             "Staples",      265,  20,  5, 150],
  ["Tata Salt 1kg",                   "Staples",       28,  70,  0, null],
  ["Fortune Sunflower Oil 1L",        "Staples",      140,  25,  5, 200],
  ["Toor Dal 1kg",                    "Staples",      160,  30,  5, 300],
  ["Moong Dal 1kg",                   "Staples",      130,   6,  5, 300],  // low stock
  ["India Gate Basmati Rice 1kg",     "Staples",      120,  40,  5, null],
  ["Besan 500g",                      "Staples",       65,  25,  5, 120],
  ["Poha 500g",                       "Staples",       40,  30,  5, 150],
  ["Suji 500g",                       "Staples",       35,  28,  5, 150],
  ["MDH Garam Masala 100g",           "Staples",       85,  30,  5, 300],
  ["Everest Turmeric Powder 100g",    "Staples",       40,  33,  5, 400],
  ["Kissan Tomato Ketchup 500g",      "Staples",      110,  24, 12, 200],

  // --- Beverages
  ["Tata Tea Gold 250g",              "Beverages",    140,   6,  5, 240],  // low stock
  ["Red Label Tea 500g",              "Beverages",    260,  14,  5, 300],
  ["Nescafe Classic 50g",             "Beverages",    175,  18, 18, 365],
  ["Coca-Cola 750ml",                 "Beverages",     40,  36, 18, 100],
  ["Frooti Mango 200ml",              "Beverages",     20,  48, 12,  70],
  ["Bisleri Water 1L",                "Beverages",     20,  60, 18, 300],
  ["Real Fruit Juice Mixed 1L",       "Beverages",    110,  15, 12,  55],

  // --- Household and personal care
  ["Surf Excel Easy Wash 1kg",        "Household",    130,   7, 18, null], // low stock
  ["Vim Dishwash Bar 200g",           "Household",     20,  45, 18, null],
  ["Harpic Toilet Cleaner 500ml",     "Household",     98,  16, 18, null],
  ["Homelite Matches (10 pack)",      "Household",     20,  40, 12, null],
  ["Lifebuoy Soap 100g",              "Personal Care", 38,  50, 18, 500],
  ["Colgate Strong Teeth 100g",       "Personal Care", 58,   3, 18, 400],  // low stock
  ["Dettol Handwash 200ml",           "Personal Care", 99,   5, 18, 400],  // low stock
  ["Clinic Plus Shampoo 80ml",        "Personal Care", 45,  28, 18, 450],
  ["Parachute Coconut Oil 200ml",     "Personal Care", 95,  22,  5, 400],
];

// [name, phone, credit_limit]
const customers = [
  ["Sharma ji",      "9876500001", 2000],
  ["Verma ji",       "9876500002", 2000],   // will end up close to the limit
  ["Gupta Aunty",    "9876500003", 2000],   // owes nothing
  ["Rajesh Bhaiya",  "9876500004", 1500],
  ["Meena Devi",     "9876500005", 5000],   // higher limit
  ["Pandey ji",      "9876500006", 2000],
  ["Rawat ji",       "9876500007", 3000],
  ["Negi ji",        "9876500008", 2000],   // owes nothing
  ["Kapoor Sahab",   "9876500009", 2000],   // owes nothing
  ["Sunita Behen",   "9876500010", 1000],   // low limit, owes almost all of it
];

// Past bills, all in the current month.
// [customer name or null for a walk-in, payment mode, days ago, [[product name, quantity], ...]]
// Totals and GST are worked out below from the product prices.
const bills = [
  ["Sharma ji",     "CREDIT", 12, [["Maggi Masala Noodles 70g", 4], ["Sugar 1kg", 1], ["Parle-G Biscuit 100g", 3]]],
  [null,            "CASH",   12, [["Parle-G Biscuit 100g", 10], ["Lays Classic Salted 52g", 4]]],
  ["Verma ji",      "CREDIT", 10, [["Aashirvaad Atta 5kg", 2], ["Fortune Sunflower Oil 1L", 1], ["Toor Dal 1kg", 2]]],
  [null,            "UPI",     9, [["Maggi Masala Noodles 70g", 6], ["Coca-Cola 750ml", 3], ["Lays Classic Salted 52g", 3]]],
  ["Gupta Aunty",   "CASH",    9, [["Amul Taaza Milk 500ml", 6], ["Britannia Bread 400g", 2], ["Eggs (6 pcs)", 2]]],
  ["Meena Devi",    "CREDIT",  8, [["Surf Excel Easy Wash 1kg", 2], ["Lifebuoy Soap 100g", 4], ["Vim Dishwash Bar 200g", 3], ["Colgate Strong Teeth 100g", 1]]],
  [null,            "CASH",    7, [["Parle-G Biscuit 100g", 12], ["Maggi Masala Noodles 70g", 5]]],
  ["Rajesh Bhaiya", "CREDIT",  6, [["Tata Tea Gold 250g", 1], ["Sugar 1kg", 2], ["Tata Salt 1kg", 1]]],
  [null,            "UPI",     5, [["Amul Taaza Milk 500ml", 8], ["Eggs (6 pcs)", 3], ["Britannia Bread 400g", 3]]],
  ["Sharma ji",     "CASH",    4, [["Amul Butter 100g", 2], ["Britannia Bread 400g", 1]]],
  ["Pandey ji",     "CREDIT",  3, [["Aashirvaad Atta 5kg", 1], ["Moong Dal 1kg", 1], ["Besan 500g", 1]]],
  [null,            "CASH",    3, [["Lays Classic Salted 52g", 6], ["Kurkure Masala Munch 90g", 3], ["Frooti Mango 200ml", 4]]],
  ["Verma ji",      "CREDIT",  2, [["Sugar 1kg", 3], ["Tata Salt 1kg", 2], ["Maggi Masala Noodles 70g", 5]]],
  [null,            "UPI",     1, [["Parle-G Biscuit 100g", 8], ["Maggi Masala Noodles 70g", 4], ["Amul Taaza Milk 500ml", 5]]],
  ["Meena Devi",    "CREDIT",  0, [["Aashirvaad Atta 5kg", 3], ["Fortune Sunflower Oil 1L", 2], ["Sugar 1kg", 2]]],
];

// Extra credit entries NOT tied to the bills above: older udhaar and payments.
// [customer name, "DEBIT" (they owe more) or "PAYMENT" (they paid), amount, days ago]
const extraLedger = [
  ["Sharma ji",     "DEBIT",   200, 40],
  ["Sharma ji",     "PAYMENT", 150, 20],
  ["Verma ji",      "DEBIT",   500, 45],
  ["Gupta Aunty",   "DEBIT",   300, 35],
  ["Gupta Aunty",   "PAYMENT", 300, 30],   // fully paid up
  ["Rajesh Bhaiya", "DEBIT",   100, 38],
  ["Rajesh Bhaiya", "PAYMENT",  50, 15],
  ["Meena Devi",    "DEBIT",   600, 42],
  ["Rawat ji",      "DEBIT",   800, 33],
  ["Sunita Behen",  "DEBIT",   950, 36],   // right at her Rs. 1000 limit
];

// ============================================================
// Insert everything. db.transaction makes it all-or-nothing:
// if anything below fails, nothing is saved (no half-filled database).
// ============================================================

const seedAll = db.transaction(() => {
  // 1. Clear old data. Children first (they point at the parents), then the parents.
  db.exec("DELETE FROM bill_items");
  db.exec("DELETE FROM bills");
  db.exec("DELETE FROM credit_ledger");
  db.exec("DELETE FROM customers");
  db.exec("DELETE FROM products");
  db.exec("DELETE FROM sqlite_sequence"); // restart ids from 1

  // 2. Products. We remember each product's id and price by name, for the bills below.
  const addProduct = db.prepare(
    "INSERT INTO products (name, category, unit_price, stock_qty, gst_percent, expiry_date) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const productByName = {};
  for (const [name, category, price, stock, gst, expiryDays] of products) {
    const expiry = expiryDays === null ? null : daysFromNow(expiryDays);
    const result = addProduct.run(name, category, price, stock, gst, expiry);
    productByName[name] = { id: result.lastInsertRowid, price, gst };
  }

  // 3. Customers. Remember each id by name.
  const addCustomer = db.prepare("INSERT INTO customers (name, phone, credit_limit) VALUES (?, ?, ?)");
  const customerIdByName = {};
  for (const [name, phone, limit] of customers) {
    customerIdByName[name] = addCustomer.run(name, phone, limit).lastInsertRowid;
  }

  // 4. Bills, their items, and (for credit bills) a DEBIT entry in the ledger.
  const addBill = db.prepare(
    "INSERT INTO bills (customer_id, bill_date, subtotal, gst_amount, total, payment_mode) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const addItem = db.prepare(
    "INSERT INTO bill_items (bill_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
  );
  const addLedger = db.prepare(
    "INSERT INTO credit_ledger (customer_id, amount, type, entry_date) VALUES (?, ?, ?, ?)"
  );

  for (const [customerName, mode, daysAgo, items] of bills) {
    // customer id (null for walk-in customers)
    let customerId = null;
    if (customerName !== null) {
      customerId = customerIdByName[customerName];
      if (customerId === undefined) throw new Error(`Seed bug: unknown customer "${customerName}"`);
    }

    // work out subtotal and GST from the items
    let subtotal = 0;
    let gstAmount = 0;
    for (const [productName, qty] of items) {
      const p = productByName[productName];
      if (!p) throw new Error(`Seed bug: unknown product "${productName}"`);
      subtotal += p.price * qty;
      gstAmount += (p.price * qty * p.gst) / 100;
    }
    subtotal = round2(subtotal);
    gstAmount = round2(gstAmount);
    const total = round2(subtotal + gstAmount);
    const date = billDate(daysAgo);

    const bill = addBill.run(customerId, date, subtotal, gstAmount, total, mode);
    for (const [productName, qty] of items) {
      const p = productByName[productName];
      addItem.run(bill.lastInsertRowid, p.id, qty, p.price); // price is copied at sale time
    }

    if (mode === "CREDIT") addLedger.run(customerId, total, "DEBIT", date);
  }

  // 5. The extra ledger entries (older udhaar and payments).
  for (const [customerName, type, amount, daysAgo] of extraLedger) {
    const customerId = customerIdByName[customerName];
    if (customerId === undefined) throw new Error(`Seed bug: unknown customer "${customerName}"`);
    addLedger.run(customerId, amount, type, daysFromNow(-daysAgo));
  }
});

seedAll();

// ============================================================
// Print a summary so you can see what was created.
// ============================================================

const count = (sql) => db.prepare(sql).get().n;

console.log("Seed complete:");
console.log("  products:       ", count("SELECT COUNT(*) AS n FROM products"));
console.log("  customers:      ", count("SELECT COUNT(*) AS n FROM customers"));
console.log("  bills:          ", count("SELECT COUNT(*) AS n FROM bills"));
console.log("  bill items:     ", count("SELECT COUNT(*) AS n FROM bill_items"));
console.log("  ledger entries: ", count("SELECT COUNT(*) AS n FROM credit_ledger"));

console.log("\nUdhaar owed by each customer (DEBIT minus PAYMENT):");
console.table(
  db
    .prepare(
      `SELECT c.name, c.credit_limit,
              ROUND(COALESCE(SUM(CASE WHEN l.type = 'DEBIT' THEN l.amount ELSE -l.amount END), 0), 2) AS owed
       FROM customers c
       LEFT JOIN credit_ledger l ON l.customer_id = c.customer_id
       GROUP BY c.customer_id
       ORDER BY owed DESC`
    )
    .all()
);