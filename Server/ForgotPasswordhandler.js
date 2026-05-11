import crypto from "crypto";
import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
import SendMail from "./SendMail.js";

export async function ForgotPasswordHandler(email) {
  let db; 

  try {
    db = await mysql.createConnection(db_details);

    const [user] = await db.execute("SELECT * FROM users WHERE User_Email=?", [
      email,
    ]);

    // Don't reveal if email exists (security)
    if (user.length === 0) {
      return { success: true, message: "If email exists, link sent" };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await db.execute(
      "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE User_Email=?",
      [rawToken, expiry, email],
    );

    const resetLink = `http://localhost:5173/reset-password/${rawToken}`;

    let mailMessage = `
      <h3>Reset Your Password</h3>
      <p>Click below link to reset password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    SendMail(email, "Password Reset", mailMessage);

    return { success: true, message: "Reset link sent" };
  } catch (err) {
    console.log(err);
    return { success: false, message: "Server error" };
  } finally {
    if (db) await db.end();
  }
}
