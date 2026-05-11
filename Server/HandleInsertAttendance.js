import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export const insertAttendance = async (data) => {
  let db;

  try {
    db = await mysql.createConnection(db_details);

    const { labour, project_id, status, advance, date, workDone } = data;

    // 🔹 1. Get wage of labour
    const [wageRows] = await db.execute(
      "SELECT wages FROM wages WHERE labourID = ?",
      [labour],
    );

    if (wageRows.length === 0) {
      return {
        success: false,
        message: "Wage not found for this labour",
      };
    }

    const wage = Number(wageRows[0].wages);

    // 🔹 2. Calculate Day_Total
    let dayTotal = 0;

    if (status === "P") {
      dayTotal = wage;
    } else if (status === "A") {
      dayTotal = 0;
    } else if (status === "H") {
      dayTotal = wage / 2;
    } else if (status === "PH") {
      dayTotal = wage * 1.5;
    } else if (status === "PP") {
      dayTotal = wage * 2;
    }

    // 🔹 3. Insert into attendance (UPDATED)
    const query = `
      INSERT INTO attendance 
      (labour_id, ProjectID, date, status, advance, Day_Total, Work_Done)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      labour,
      project_id || null,
      date,
      status,
      advance || 0,
      dayTotal,
      workDone || null,
    ]);

    return {
      success: true,
      message: "Attendance saved successfully",
    };
  } catch (err) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return {
        success: false,
        message: "Attendance already exists for this labour on this date",
      };
    }

    return {
      success: false,
      message: "Database error",
    };
  } finally {
    if (db) await db.end();
  }
};
