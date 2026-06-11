import { db_details } from "./dbconfig.js";
import mysql from "mysql2/promise";
export const getServiceRequests = async (req, res) => {
  let db;

  try {
    db = await mysql.createConnection(db_details);

    const sql = `
      SELECT * FROM servicerequestrecords
      ORDER BY RequestID DESC
    `;

    const [rows] = await db.execute(sql);

    return res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);

    return res.json({
      success: false,
      message: "Failed to fetch data",
    });
  } finally {
    if (db) await db.end();
  }
};
