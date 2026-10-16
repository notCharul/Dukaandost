import Database from "better-sqlite3";
import fs from "node:fs";

const db = new Database("shop.db");
db.pragma("foreign_keys = ON");

const schema = fs.readFileSync("schema.sql", "utf8");
db.exec(schema);                         

export default db; 

