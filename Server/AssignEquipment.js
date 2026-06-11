import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export async function AssignEquipments(
  selectedLabour,
  selectedEquip,
  quantity,
) {
  let db;

  try {
    db = await mysql.createConnection(db_details);
    await db.beginTransaction();

    const [equipRows] = await db.execute(
      `SELECT Total_Quantity, Assigned_Quantity 
       FROM equipments 
       WHERE Equipment_ID = ?`,
      [selectedEquip],
    );

    if (equipRows.length === 0) {
      await db.rollback();
      return { success: false, message: "Equipment not found" };
    }

    const total = equipRows[0].Total_Quantity;
    const assigned = equipRows[0].Assigned_Quantity;
    const available = total - assigned;

    if(available === 0){
      await db.rollback();
         return {
           success: false,
           message: `No Equipments Available to Assign`,
         };
    }
    if (quantity > available) {
      await db.rollback();
      return {
        success: false,
        message: `Only ${available} available`,
      };
    }

    const [existing] = await db.execute(
      `SELECT Quantity_Assigned 
       FROM equipment_assignments 
       WHERE labourID = ? AND EquipmentID = ?`,
      [selectedLabour, selectedEquip],
    );

    if (existing.length > 0) {
      await db.execute(
        `UPDATE equipment_assignments 
         SET Quantity_Assigned = Quantity_Assigned + ? 
         WHERE labourID = ? AND EquipmentID = ?`,
        [quantity, selectedLabour, selectedEquip],
      );
    } else {
      await db.execute(
        `INSERT INTO equipment_assignments 
         (labourID, EquipmentID, Quantity_Assigned) 
         VALUES (?, ?, ?)`,
        [selectedLabour, selectedEquip, quantity],
      );
    }

    await db.execute(
      `UPDATE equipments 
       SET Assigned_Quantity = Assigned_Quantity + ? 
       WHERE Equipment_ID = ?`,
      [quantity, selectedEquip],
    );

    await db.commit();

    return {
      success: true,
      message: "Equipment Assigned Successfully",
    };
  } catch (err) {
    if (db) await db.rollback();
    console.error(err);

    return {
      success: false,
      message: "Failed to Assign Equipment",
    };
  } finally {
    if (db) await db.end();
  }
}
