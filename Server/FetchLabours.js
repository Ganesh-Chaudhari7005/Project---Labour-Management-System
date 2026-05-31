import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

async function FetchLabours() {
  
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
    [rows] = await db.execute(`
  SELECT 
    l.ID,
    l.Name,
    l.Email,
    l.LabType,
    la.ProjectID,
    p.ProjectName
  FROM labours l
  LEFT JOIN labour_assignments la 
    ON l.ID = la.LabourID
  LEFT JOIN projects p 
    ON p.ProjectID = la.ProjectID
`);

    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (db) await db.end();
  }
}

export default FetchLabours;
