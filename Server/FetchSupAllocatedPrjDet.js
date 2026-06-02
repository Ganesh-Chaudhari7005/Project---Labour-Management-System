import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

async function FetchSupAllocatedPrjDet(SupID) {
    console.log("hii", SupID);
    
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
      `
    SELECT
        projects.ProjectID,
        projects.ProjectName,
        projects.Address,
        projects.Status,
        supervisor_assignments.*
    FROM projects
    JOIN supervisor_assignments
        ON projects.ProjectID = supervisor_assignments.ProjectID
    WHERE supervisor_assignments.SupervisorID ='${SupID}';
        
        `,
      [SupID],
    );

    return rows;
  } catch (err) {
    console.log(err);
  } finally {
    if (db) await db.end();
  }
}

export default FetchSupAllocatedPrjDet;
