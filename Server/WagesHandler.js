import { db_details } from "./dbconfig.js";
import mysql from "mysql2/promise";

export const GetLabourWages = async (req, res) => {
  let db;

  try {
    db = await mysql.createConnection(db_details);

    const [result] = await db.execute(`
      SELECT 
        labours.ID,
        labours.Name,
        labours.LabType,
        wages.wages
      FROM wages
      JOIN labours
      ON wages.labourID = labours.ID
    `);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wages",
    });
  } finally {
    if (db) await db.end();
  }
};

export const UpdateLabourWages = async (req, res) => {
  let db;

  try {
    db = await mysql.createConnection(db_details);

    const { labourID, wages } = req.body;

    await db.execute(
      `
      UPDATE wages
      SET wages = ?
      WHERE labourID = ?
      `,
      [wages, labourID],
    );

    res.json({
      success: true,
      message: "Wages updated successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Failed to update wages",
    });
  } finally {
    if (db) await db.end();
  }
};
