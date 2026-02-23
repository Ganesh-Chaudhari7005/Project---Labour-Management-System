import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
export async function HandleProfileUpdate(
  profilename,
  profileEmail,
  profilePhone,
  profileAddr,
  username,
) 
 
{
    console.log(profilename, profileEmail, username

    );
    
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

  try {
    let result;
    [result] = await db.execute(
      `UPDATE users 
             SET runame = ?,
             phone = ?,
             email =?,
            address = ?
            WHERE username = ? `,
            [profilename, profilePhone, profileEmail, profileAddr, username]
    );

    if(result.affectedRows ===0){
        return {
          success: false,
          message: "User not found or no changes made.",
        };
    }
    return {
      success: true,
      message: "Profile Updated Successfully",
    };
  } catch (err) {
    console.log("Failed to Update Profile Details");
    return {
      success: false,
      message: "Unable to update details. Please try again later.",
    };
  }finally{
    if(db) await db.end();
  }
}
