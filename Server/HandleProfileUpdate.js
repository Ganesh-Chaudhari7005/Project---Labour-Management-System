import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
export async function HandleProfileUpdate(
  profilename,
  profileEmail,
  profilePhone,
  profileAddr,
  userEmail,
  roleInfo,
  filepath
) {
  let db;
  let currenttable;
  if(roleInfo ==="Admin"){
    currenttable = "System_Admin";
  }else if(roleInfo ==="Supervisor"){
    currenttable = "Supervisors";
  }else if(roleInfo === "Client"){
    currenttable = "Clients";
  }else if(roleInfo ==="Labour"){
    currenttable = "Labours"
  }

  
  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    console.log("Failed to Connect Database");
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  try {
    let result;
    if(filepath){
      [result] = await db.execute(
        `UPDATE ${currenttable} 
             SET Name = ?,
             Phone = ?,
             Email =?,
            Address = ?,
            profileImgPath = ?
            WHERE Email = ? `,
        [
          profilename,
          profilePhone,
          profileEmail,
          profileAddr,
          filepath,
          userEmail
        ],
      );
    }else{
       [result] = await db.execute(
         `UPDATE ${currenttable} 
             SET Name = ?,
             Phone = ?,
             Email =?,
            Address = ?
            WHERE Email = ? `,
         [
           profilename,
           profilePhone,
           profileEmail,
           profileAddr,
           userEmail
         ],
       );
    }

    if (result.affectedRows === 0) {
      return {
        success: false,
        message: "User not found or no changes made.",
      };
    }
    return {
      success: true,
      message: "Profile Updated Successfully",
      UpdatedImgPath : filepath
    };
  } catch (err) {
    console.log("Failed to Update Profile Details", err);
    return {
      success: false,
      message: "Unable to update details. Please try again later.",
    };
  } finally {
    if (db) await db.end();
  }
}
