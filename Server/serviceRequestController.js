import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export const insertServiceRequest = async (req, res) => {
  const { name, email, mobile, address, city, pincode, requirement } = req.body;

  if (
    !name ||
    !email ||
    !mobile ||
    !address ||
    !city ||
    !pincode ||
    !requirement
  ) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  }

  let db;

  try {
    db = await mysql.createConnection(db_details);

    const sql = `
      INSERT INTO servicerequestrecords
      (PersonName, PersonEmail, PersonMobile, PersonAddress, PersonCity, Pincode, Requirement)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      name,
      email,
      mobile,
      address,
      city,
      pincode,
      requirement,
    ]);

    return res.json({
      success: true,
      message: "Request submitted successfully",
      requestId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Database error",
    });
  } finally {
    if (db) await db.end();
  }
};

export const deleteServiceRequest = async (req, res) => {
  const { id } = req.params;

  let db;

  try {
    db = await mysql.createConnection(db_details);

    const sql = `DELETE FROM ServiceRequestRecords WHERE RequestID = ?`;

    const [result] = await db.execute(sql, [id]);

    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "Request not found",
      });
    }

    return res.json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.json({
      success: false,
      message: "Database error",
    });
  } finally {
    if (db) await db.end();
  }
};