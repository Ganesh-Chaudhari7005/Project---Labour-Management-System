import mysql from 'mysql2/promise';
import { db_details } from './dbconfig.js';

async function FetchInStockEquipments() {
  let db;
  try {
    db = await mysql.createConnection(db_details);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Failed to Connect Database");
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  let rows;

  try {
    [rows] = await db.execute(
      "select * from equipments where Total_Quantity > 0;",
    );

    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (db) await db.end();
  }
} 

export default FetchInStockEquipments;