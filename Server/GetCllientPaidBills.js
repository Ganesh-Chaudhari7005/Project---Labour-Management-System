
import mysql from 'mysql2/promise';
import { db_details } from './dbconfig.js';

async function GetCllientPaidBills(ClientId) {
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

  try {
    let [PaidBills] = await db.execute(`
        SELECT all_bills.*
        FROM all_bills
        JOIN projects
        ON projects.ProjectID = all_bills.ProjectID
        WHERE projects.ClientID = '${ClientId}' and all_bills.send_to_client = 1 and all_bills.Status = 'Paid' ;`);

    if (PaidBills.length === 0) {
      return {
        success: false,
        message: "No Bills",
      };
    } else {
      return {
        success: true,
        Bills: PaidBills,
      };
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (db) await db.end();
  }
}

export default GetCllientPaidBills;