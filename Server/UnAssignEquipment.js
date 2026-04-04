import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export async function UnAssignEquipments(
  selectedLabour,
  selectedEquip,
  quantity,
) {
  let db;

  try {
    db = await mysql.createConnection(db_details);
    await db.beginTransaction();

    const [rows] = await db.execute(
      `SELECT * FROM Equipment_Assignments WHERE labourID = ? AND EquipmentID = ?`,
      [selectedLabour, selectedEquip],
    );

    if (rows.length === 0) {
      await db.rollback();
      return {
        success: false,
        message: "Selected Equipment is not assigned to selected labour",
      };
    }

    const assignedQty = rows[0].Quantity_Assigned;

    if (quantity > assignedQty) {
      await db.rollback();
      return {
        success: false,
        message: "Entered Quantity is greater than Assigned Quantity",
      };
    }

    await db.execute(
      `UPDATE Equipment_Assignments 
       SET Quantity_Assigned = Quantity_Assigned - ? 
       WHERE labourID = ? AND EquipmentID = ?`,
      [quantity, selectedLabour, selectedEquip],
    );

    await db.execute(
      `UPDATE equipments 
       SET Assigned_Quantity = Assigned_Quantity - ? 
       WHERE Equipment_ID = ?`,
      [quantity, selectedEquip],
    );

    const remaining = assignedQty - quantity;

    if (remaining === 0) {
      await db.execute(
        `DELETE FROM Equipment_Assignments 
         WHERE labourID = ? AND EquipmentID = ?`,
        [selectedLabour, selectedEquip],
      );
    }

    await db.commit();

    return {
      success: true,
      message: "Equipment UnAssigned Successfully",
    };
  } catch (err) {
    if (db) await db.rollback();
    console.error(err);

    return {
      success: false,
      message: "Something went wrong",
    };
  } finally {
    if (db) await db.end();
  }
}
