import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

async function RemoveEquipment(selectedEquip, selectedQuantity) {
  let db;

  try {
    db = await mysql.createConnection(db_details);
    await db.beginTransaction();

    selectedQuantity = Number(selectedQuantity);

    const [rows] = await db.execute(
      `SELECT Total_Quantity, Assigned_Quantity 
       FROM equipments 
       WHERE Equipment_ID = ?`,
      [selectedEquip],
    );

    if (rows.length === 0) {
      await db.rollback();
      return {
        success: false,
        message: "Equipment not found",
      };
    }

    const total = rows[0].Total_Quantity;
    const assigned = rows[0].Assigned_Quantity;

    if (selectedQuantity > total) {
      await db.rollback();
      return {
        success: false,
        message: "Entered quantity is greater than current stock",
      };
    }

    if (total - selectedQuantity < assigned) {
      await db.rollback();
      return {
        success: false,
        message: `Cannot remove. ${assigned} already assigned`,
      };
    }

    const [result] = await db.execute(
      `UPDATE equipments 
       SET Total_Quantity = Total_Quantity - ? 
       WHERE Equipment_ID = ?`,
      [selectedQuantity, selectedEquip],
    );

    if (result.affectedRows === 1) {
      await db.commit();
      return {
        success: true,
        message: "Equipment removed successfully",
      };
    } else {
      await db.rollback();
      return {
        success: false,
        message: "Update failed",
      };
    }
  } catch (err) {
    if (db) await db.rollback();
    console.error(err);

    return {
      success: false,
      message: "Failed to remove equipment",
    };
  } finally {
    if (db) await db.end();
  }
}

export default RemoveEquipment;
