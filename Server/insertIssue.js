
import { db_details } from "./dbconfig.js";
import mysql from "mysql2/promise";
const insertIssue = async (req, res) => {
  let db;
     try {
       db = await mysql.createConnection(db_details);
     } catch (err) {
       console.log("Failed to Connect Database");
       return {
         imageStatus: false,
       };
     }
  try {
    const { project, description, clientID } = req.body;
console.log(project, description, clientID);

    // Validation
    if (!project || !description || !clientID) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Insert Query
    await db.execute(
      `
      INSERT INTO ReportIssues (
        ProjectID,
        ClientID,
        IssueDescription
      )
      VALUES (?, ?, ?)
      `,
      [project, clientID, description],
    );

    return res.json({
      success: true,
      message: "Issue submitted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default insertIssue;
