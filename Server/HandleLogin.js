import { db_details } from "./dbconfig.js";
import mysql from "mysql2/promise";
export async function HandleLogin(UserEmail, Pass) {
  let db;
  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    console.log("Failed to connect Database");
    console.log(err);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  let rows;
  let rows2;

  try {
    [rows] = await db.execute(
      `Select * from Users where User_Email=? and User_Pass=?`,
      [UserEmail, Pass],
    );
  } catch (err) {
    console.log("Failed to Fetch Details");
    console.log(err);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  } 
  if (rows.length > 0) {
    if (UserEmail == rows[0].User_Email && Pass == rows[0].User_Pass) {
      console.log(rows[0]);
      let temptable 
      if(rows[0].User_Role === "Admin"){
        temptable = "System_Admin"
      }else if(rows[0].User_Role === "Labour"){
        temptable = "Labours"
      }else if(rows[0].User_Role === "Client"){
        temptable = "Clients"
      }else if(rows[0].User_Role === "Supervisor"){
        temptable = "Supervisors"
      }
      try {
        console.log(temptable);
        [rows2] = await db.execute(`Select * from ${temptable}`);
      } catch (err) {
        console.log("Error in rows2", err);
      } finally {
        if (db) await db.end();
      }
      console.log("ProfileImage is : ", rows2[0].profileImgPath);
      console.log("Address is ", rows2[0].Address)
      console.log(rows2);
      
      return {
        success: true,
        funame: rows2[0].Name,
        urole: rows[0].User_Role,
        uemail: rows2[0].Email,
        uaddr: rows2[0].Address,
        uphone: rows2[0].Phone,
        profileimgpath : rows2[0].profileImgPath,
        // databaseUserName: rows[0].username,
        message: "Login Successfull",
      };

      
      
    } else {
      console.log("No data");
      return {
        success: false,
        message: "Invalid Credentials",
      };
    }
  } else if (rows.length == 0) {
    console.log("No data");
    return {
      success: false,
      message: "Invalid Credentials",
    };
  }
}
