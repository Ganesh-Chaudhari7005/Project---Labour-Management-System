import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export const getSupervisors = async (req, res) => {
  let db;
  console.log("hello");

  try {
    db = await mysql.createConnection(db_details);

    const [rows] = await db.query(`
      SELECT ID, Name, IsAvailable
      FROM supervisors
    `);
    console.log(rows);

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (db) await db.end();
  }
};

export const getProjects = async (req, res) => {
  let db;

  try {
    db = await mysql.createConnection(db_details);

    const [rows] = await db.query(`
      SELECT ProjectID, ProjectName
      FROM projects
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (db) await db.end();
  }
};

export const assignSupervisor = async (req, res) => {
  const { supervisorId, projectId } = req.body;

  let db;

  try {
    db = await mysql.createConnection(db_details);

    await db.query(
      `INSERT INTO Supervisor_Assignments
      (SupervisorID, ProjectID)
      VALUES (?, ?)`,
      [supervisorId, projectId],
    );
    await db.query(`UPDATE supervisors
        SET IsAvailable = 0
        WHERE ID = ?`,[supervisorId]);
    res.json({
      message: "Supervisor assigned successfully",
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Supervisor already assigned to this project",
      });
    }

    res.status(500).json({
      message: err.message,
    });
  } finally {
    if (db) await db.end();
  }
};

export const getSupervisorAssignments = async (req, res) => {
  let db;

  try {
    db = await mysql.createConnection(db_details);

    const [rows] = await db.query(`
      SELECT
        sa.AssignID,
        sa.SupervisorID,
        s.Name,
        p.ProjectName,
        sa.Assign_Date
      FROM Supervisor_Assignments sa
      JOIN supervisors s
        ON s.ID = sa.SupervisorID
      JOIN projects p
        ON p.ProjectID = sa.ProjectID
      ORDER BY sa.Assign_Date DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  } finally {
    if (db) await db.end();
  }
};

export const removeSupervisorAssignment = async (req, res) => {
  const { assignId, supervisorId } = req.body;

  let db;

  try {
    db = await mysql.createConnection(db_details);

    await db.query(
      `DELETE FROM Supervisor_Assignments
       WHERE AssignID = ?`,
      [assignId],
    );

    await db.query(
      `UPDATE supervisors
       SET IsAvailable = 1
       WHERE ID = ?`,
      [supervisorId],
    );

    res.json({
      message: "Assignment removed",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  } finally {
    if (db) await db.end();
  }
};
