import mysql from 'mysql2/promise';
import { db_details } from './dbconfig.js';

async function GetProjectDetails(id) {
  let db;

  try {
    db = await mysql.createConnection(db_details);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Failed to Connect Database");
    return {
      success: false,
      message: "Database connection failed",
    };
  }

  try {
    console.log("projectid:", id);

    // ✅ Validate ID first
    if (id === undefined || id === null) {
      return {
        success: false,
        message: "Project ID is required",
      };
    }

    const [rows] = await db.execute(
      "SELECT * FROM projects WHERE ProjectID = ?",
      [id],
    );

    // ✅ Check if project exists
    if (rows.length === 0) {
      return {
        success: false,
        message: "Project not found",
      };
    }

    const project = rows[0];
    const clientId = project.ClientID;
    console.log("clientid is", clientId);
    
    const [clientDetails] = await db.execute(
      "SELECT * FROM clients WHERE ID=?",
      [clientId],
    );

    return {
      success: true,
      projectdetails: project,
      clientDetails: clientDetails[0] || null,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error fetching project details",
    };
  } finally {
    if (db) await db.end();
  }
}

export default GetProjectDetails;