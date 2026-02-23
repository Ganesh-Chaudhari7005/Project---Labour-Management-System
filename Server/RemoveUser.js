import mysql from "mysql2";
import { db_details } from "./dbconfig.js";
async function RemoveUser(removeusername) {
  let db;
  try {
    db = await mysql.createConnection(db_details);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.log("Failed to Connect Database");
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
  let removeRes;
  try {
    removeRes = await db.execute("DELETE FROM users WHERE username = ?", [
      removeusername,
    ]);
    return {
      success: true,
      message: "User Deleted Successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: "Failed to Remove User.",
    };
  } finally {
    if (db) await db.end();
  }
}

export default RemoveUser;
