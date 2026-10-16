CREATE TABLE IF NOT EXISTS products (
  product_id  INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  unit_price  REAL NOT NULL CHECK (unit_price > 0),
  stock_qty   INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  gst_percent REAL NOT NULL DEFAULT 0 CHECK (gst_percent >= 0),
  expiry_date TEXT              -- 'YYYY-MM-DD', NULL for things that never expire
);


CREATE TABLE IF NOT EXISTS customers(

    customer_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    credit_limit REAL NOT NULL DEFAULT 2000 CHECK(credit_limit >= 0)
);

CREATE TABLE IF NOT EXISTS bills(

  bill_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER ,
  bill_date TEXT NOT NULL DEFAULT (date('now', 'localtime')),
  subtotal REAL NOT NULL,
  gst_amount REAL NOT NULL,
  total REAL NOT NULL,
  payment_mode TEXT NOT NULL CHECK  (payment_mode IN ('CASH','UPI','CREDIT')) ,
  CHECK (payment_mode <> 'CREDIT' OR customer_id IS NOT NULL),
  FOREIGN KEY(customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS bill_items(
  bill_id INTEGER NOT NULL ,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL CHECK(quantity > 0),
  price REAL NOT NULL,

  PRIMARY KEY (bill_id, product_id),

  FOREIGN KEY(product_id) REFERENCES products(product_id),
  FOREIGN KEY(bill_id) REFERENCES bills(bill_id)
);

CREATE TABLE IF NOT EXISTS credit_ledger(
  entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  amount REAL NOT NULL CHECK(amount>0),
  type TEXT NOT NULL CHECK(type IN('DEBIT','PAYMENT')),
  entry_date TEXT NOT NULL DEFAULT (date('now', 'localtime')),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);