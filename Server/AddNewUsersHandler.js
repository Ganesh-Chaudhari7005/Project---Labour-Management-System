import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
import SendMail from "./SendMail.js";
import {CreateUserId, CreateAdminId} from "./UserIDGenerator.js";
import bcrypt from "bcrypt";

export async function AddUserHandler(
  addUName,
  addUEmail,
  addUPass,
  addURole,
) {


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

  if (!addUName || !addUEmail || !addUPass || !addURole) {
    return {
      success: false,
      message: "Missing Required Fields",
    };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addUEmail)) {
    return {
      success: false,
      message: "Invalid email format",
    };
  }

  let checkEmailExists;
  let insertStatus;
  
  try {
    checkEmailExists = await db.execute(`SELECT * FROM users WHERE User_Email=?`, [
      addUEmail,
    ]);
    if (checkEmailExists[0].length > 0) {
      console.log("Email already exists");
      return {
        success: false,
        message: "Email Already Exists",
      };
    } else {
      const saltrounds = 10;
      const hashedPassword = await bcrypt.hash(addUPass, saltrounds);
      let uid = CreateUserId(); 
      insertStatus = await db.execute(
        "INSERT INTO users (User_ID, User_Name, User_Email, User_Pass, User_Role) values(?, ?, ?, ?, ?)", 
        [uid,addUName, addUEmail, hashedPassword, addURole], 
      );

      let currenttable;
      if (addURole === "Admin" || addURole === "admin") {
        currenttable = "system_admin";
      } else if (addURole === "Supervisor") {
        currenttable = "supervisors";
      } else if (addURole === "Client") {
        currenttable = "clients";
      } else if (addURole === "Labour") {
        currenttable = "labours";
      }

      let AdmId = CreateAdminId();
      db.execute(
        `INSERT INTO ${currenttable} (ID, Name , Email) values (? , ? , ?)`,
        [AdmId, addUName, addUEmail]
      )
      let mailMessage = `<h2 style="font-family : 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif">You have been given access to Royal Enterprises Portal</h2>
                        <p>Login :<a href="http://192.168.31.208:5173/admin" target="_blank">http://192.168.31.208:5173/</a></p>
      `;

    let mailSubject = "Access Granted";
 
    SendMail(addUEmail, mailSubject, mailMessage);
      return {
        success: true,
        message: "User added successfully",
      };

    }     
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Server error",
    };
  } finally {
    if (db) await db.end();
  }
}
