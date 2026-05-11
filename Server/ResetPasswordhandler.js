import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
import bcrypt from "bcrypt";
export async function ResetPasswordHandler(token, newPassword) {
  let db;
console.log("reset called");

  try {
    db = await mysql.createConnection(db_details);

    const [user] = await db.execute(
      `SELECT * FROM users 
       WHERE reset_token=? AND reset_token_expiry > NOW()`,
      [token],
    );

    if (user.length === 0) {
      return {
        success: false,
        message: "Invalid or expired link",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      `UPDATE users 
   SET User_Pass=?, reset_token=NULL, reset_token_expiry=NULL 
   WHERE reset_token=?`,
      [hashedPassword, token],
    );

    return { success: true, message: "Password updated successfully" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Server error" };
  } finally {
    console.log("resetend");
    
    if (db) await db.end();
  }
}
