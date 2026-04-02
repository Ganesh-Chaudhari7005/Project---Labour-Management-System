import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
export async function AddEquipment(SelectedEquipmentID, Quantity) {
  let db;
  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    return {
      success: false,
      message: "Failed to connect database",
    };
  }

  try {
    console.log(SelectedEquipmentID);
    
    let [rows] = await db.execute(
      "select * from equipments where Equipment_ID =?",
      [SelectedEquipmentID],
    );

    if (rows.length > 0) {
      console.log("Equipment exists");
      await db.execute(`update equipments set Total_Quantity = Total_Quantity + ${Quantity} where Equipment_ID=?`,[SelectedEquipmentID])
    } else {
      console.log("Not exists");
    }
  } catch (err) {
    console.log(err);
  }
}
