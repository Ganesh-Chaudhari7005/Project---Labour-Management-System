import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
import { log } from "console";
import { CreateEquipmentID } from "./UserIDGenerator.js";
export async function AddEquipment(finalEquipment, Quantity) {
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
    console.log(finalEquipment);

    let [rows] = await db.execute(
      "select * from equipments where Equipment_ID =?",
      [finalEquipment],
    );

    if (rows.length > 0) {
      console.log("Equipment exists");
      let [insertStatus] = await db.execute(
        `update equipments set Total_Quantity = Total_Quantity + ${Quantity} where Equipment_ID=?`,
        [finalEquipment],
      );

      if (insertStatus.affectedRows === 1) {
        console.log("Equipment Added");
        return {
          success: true,
          message: "Equipment Added Successfully",
        };
      } else {
        return {
          success: false,
          message: "Server Error",
        };
      }
    } else {
      console.log("Not exists");
      console.log(finalEquipment);
      let equipmentId = CreateEquipmentID();
      let [otherInsert] = await db.execute(
        `insert into equipments(Equipment_ID,Equipment_Name,Total_Quantity) values(?,?,?)`,
        [equipmentId, finalEquipment, Quantity],
      );

      if (otherInsert.affectedRows === 1) {
        console.log("Equipment Added");
        return {
          success: true,
          message: "Equipment Added Successfully",
        };
      } else {
        return {
          success: false,
          message: "Server Error",
        };
      }
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Internal Server Error",
    };
  } finally {
    if (db) await db.end();
  }
}
