import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

// ✅ Get labours
export const getLabours = async (req, res) => {
  let db;
  try {
    db = await mysql.createConnection(db_details);

    const [rows] = await db.query("SELECT ID, Name, IsAvailable FROM labours");

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (db) await db.end();
  }
};

// ✅ Get projects
export const getProjects = async (req, res) => {
  let db;
  try {
    db = await mysql.createConnection(db_details);

    const [rows] = await db.query(
      "SELECT ProjectID, ProjectName FROM projects",
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (db) await db.end();
  }
};

// ✅ Assign labour (with transaction)
export const assignLabour = async (req, res) => {
  const { labourId, projectId } = req.body;

  let db;

  try {
    db = await mysql.createConnection(db_details);

    await db.beginTransaction();

    // check availability
    const [check] = await db.query(
      "SELECT IsAvailable FROM labours WHERE ID = ?",
      [labourId],
    );

    if (check[0].IsAvailable === 0) {
      throw new Error("Labour not available");
    }

    // insert assignment
    await db.query(
      `INSERT INTO labour_assignments (LabourID, ProjectID)
       VALUES (?, ?)`,
      [labourId, projectId],
    );

    // update availability
    await db.query("UPDATE labours SET IsAvailable = 0 WHERE ID = ?", [
      labourId,
    ]);

    await db.commit();

    res.json({ message: "Assigned successfully" });
  } catch (err) {
    if (db) await db.rollback();

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Already assigned" });
    }

    res.status(500).json({ message: err.message });
  } finally {
    if (db) await db.end();
  }
};

// ✅ Get assignments
export const getAssignments = async (req, res) => {
  let db;
  try {
    db = await mysql.createConnection(db_details);

    const [rows] = await db.query(`
      SELECT 
        la.AssignmentID,
        l.Name,
        p.ProjectName,
        la.AssignDate
      FROM labour_assignments la
      JOIN labours l ON l.ID = la.LabourID
      JOIN projects p ON p.ProjectID = la.ProjectID
      ORDER BY la.AssignDate DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (db) await db.end();
  }
};

// ✅ Remove assignment
export const removeAssignment = async (req, res) => {
  const { id } = req.params;

  let db;

  try {
    db = await mysql.createConnection(db_details);

    await db.beginTransaction();

    const [rows] = await db.query(
      "SELECT LabourID FROM labour_assignments WHERE AssignmentID = ?",
      [id],
    );

    const labourId = rows[0]?.LabourID;

    await db.query("DELETE FROM labour_assignments WHERE AssignmentID = ?", [
      id,
    ]);

    await db.query("UPDATE labours SET IsAvailable = 1 WHERE ID = ?", [
      labourId,
    ]);

    await db.commit();

    res.json({ message: "Removed successfully" });
  } catch (err) {
    if (db) await db.rollback();
    res.status(500).json(err);
  } finally {
    if (db) await db.end();
  }
};
