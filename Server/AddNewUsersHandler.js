import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
import SendMail from "./SendMail.js";
export async function AddUserHandler(
  addUName,
  addUEmail,
  addUNumber,
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

  if (!addUName || !addUEmail || !addUNumber || !addUPass || !addURole) {
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
    checkEmailExists = await db.execute(`SELECT * FROM users WHERE email=?`, [
      addUEmail,
    ]);
    if (checkEmailExists[0].length > 0) {
      console.log("Email already exists");
      return {
        success: false,
        message: "Email Already Exists",
      };
    } else {
      insertStatus = await db.execute(
        "INSERT INTO users (runame,email,phone,password,role) values(?, ?, ?, ?,?)",
        [addUName, addUEmail, addUNumber, addUPass, addURole],
      );
      let mailMessage = `<h2 style="font-family : 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif">You have been given access to Royal Enterprises Portal</h2>
                        <p>Login :<a href="http://192.168.31.208:5173/admin" target="_blank">http://192.168.31.208:5173/</a></p>
                        <p>Password : ${addUPass}</p> 
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
