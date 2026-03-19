import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
export async function GetProfilePictureHandler(email, role) {
  let db;
  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    console.log("Failed to Connect Database");
    return {
      imageStatus: false,
    };
  }

  let currenttable;
  if (role === "Admin") {
    currenttable = "System_Admin";
  } else if (role === "Supervisor") {
    currenttable = "Supervisors";
  } else if (role === "Client") {
    currenttable = "Clients";
  } else if (role === "Labour") {
    currenttable = "Labours";
  }

  let result;
  try {
    result = await db.execute(
      `SELECT profileImgPath FROM ${currenttable} where Email = '${email}'`,
    );
    console.log("All user" ,result);
    return result[0];
  } catch (err) {
    console.log(err);
  } finally {
    if (db) await db.end();
  }
}
