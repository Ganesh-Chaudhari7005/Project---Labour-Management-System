import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

async function GetPendingBillInfo(works, projectID) {
  let db;

  try {
    db = await mysql.createConnection(db_details);
    console.log("Database Connected Successfully");

    if (!works || works.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const query = `
      SELECT 
        bd.WorkType,  
        SUM(bd.Area) AS totalArea,
        MAX(bd.Rate) AS Rate
      FROM bill_details bd
      JOIN all_bills ab ON bd.BillID = ab.BillID
      WHERE ab.ProjectID = ?
      GROUP BY bd.WorkType;
    `;

    const [rows] = await db.execute(query, [projectID]);

    // 🔹 Convert DB result into map
    const billedMap = {};
    rows.forEach((row) => {
      billedMap[row.WorkType] = {
        area: Number(row.totalArea),
        rate: Number(row.Rate),
      };
    });

    // 🔹 Ensure all works are returned
    const result = works.map((work) => ({
      WorkType: work,
      billedArea: billedMap[work]?.area || 0,
      rate: billedMap[work]?.rate || 0,
    }));


    return {
      success: true,
      data: result,
    };
  } catch (err) {
    console.log("Error:", err);

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  } finally {
    if (db) await db.end();
  } 
}

export default GetPendingBillInfo;
