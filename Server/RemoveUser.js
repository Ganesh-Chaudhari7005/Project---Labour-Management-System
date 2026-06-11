import mysql from "mysql2";
import { db_details } from "./dbconfig.js";
async function RemoveUser(removeuseremail, role) {
  let db;
  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    console.log("Failed to Connect Database");
    return {
      success: false,    
      message: "Something went wrong. Please try again later.",
    };
  }
  let removeRes;
 console.log("Role : ", role);
 
    let currenttable;
    if (role.toLowerCase() === "admin") {
      currenttable = "system_admin";
    } else if (role.toLowerCase() === "supervisor") {
      currenttable = "supervisors";
    } else if (role.toLowerCase() === "clients") {
      currenttable = "clients";
    } else if (role.toLowerCase() === "labour") {
      currenttable = "labours";
    }
  try {
    if(!currenttable){
       console.log(currenttable);

      throw new Error("Invalid Role Table not Found");
      
    }
    removeRes = await db.execute(
      `DELETE FROM users WHERE User_Email = ?`,
      [removeuseremail],
    );
    // await db.execute(`DELETE FROM ${currenttable} WHERE Email = ?`, 
    //   [removeuseremail],
    // );
    return {
      success: true,
      message: "User Deleted Successfully",
    };
  } catch (err) {
    console.log(err);
    
    return {
      success: false,
      message: "Failed to Remove User.",
    };
  } finally {
    if (db) await db.end();
  }
}

export default RemoveUser;
