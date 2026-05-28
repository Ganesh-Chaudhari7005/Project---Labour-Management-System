import { db_details } from "./dbconfig.js";
import mysql from "mysql2/promise";
const insertFeedback = async (req, res) => {
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
    const { project, feedback, rating, clientID } = req.body;

    // Validation
    if (!project || !feedback || !rating || !clientID) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Insert Feedback
    await db.execute(
      `
      INSERT INTO Feedback (
        ProjectID,
        ClientID,
        Rating,
        Feedback
      )
      VALUES (?, ?, ?, ?)
      `,
      [project, clientID, rating, feedback],
    );

    return res.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default insertFeedback;