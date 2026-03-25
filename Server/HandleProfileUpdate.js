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
  if(roleInfo ==="Admin" || roleInfo === "admin"){
    currenttable = "system_admin";
  }else if(roleInfo ==="Supervisor"){
    currenttable = "Supervisors";
  }else if(roleInfo === "Client"){
    currenttable = "Clients";
  }else if(roleInfo ==="Labour" || roleInfo === "labour"){
    currenttable = "Labours"
  }

  console.log("-------------");
  console.log(profileAddr);
  console.log(profileEmail);
  console.log(profilePhone);
  console.log(profilename);
  console.log(roleInfo);
  console.log(currenttable);
  
  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    console.log("Failed to Connect Database");
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
console.log("Updating user with email:", profileEmail);
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

      let [checkImgExists] = await db.execute(`Select profileImgPath from Users where User_Email = ?`,
        [profileEmail]
      )

      if (!checkImgExists[0].profileImgPath){
        db.execute('UPDATE Users set profileImgPath = ? where User_Email = ?',
          [filepath, profileEmail]
        )
      }
      
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
