console.log("POOL FILE LOADED");
import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export const pool = mysql.createPool({
  ...db_details,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
