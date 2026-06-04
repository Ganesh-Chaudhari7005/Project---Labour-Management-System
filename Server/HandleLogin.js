import { db_details } from "./dbconfig.js";
import mysql from "mysql2/promise";
import generateToken from "./utils/jwt.js";
import bcrypt from "bcrypt";

export async function HandleLogin(UserEmail, Pass) {
  let db;

  try {
    db = await mysql.createConnection(db_details);

    // Find user
    const [rows] = await db.execute(
      "SELECT * FROM Users WHERE User_Email = ?",
      [UserEmail],
    );

    if (rows.length === 0) {
      return {
        success: false,
        message: "Invalid Credentials",
      };
    }

    const user = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(Pass, user.User_Pass);

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid Credentials",
      };
    }

    // Generate token
    const token = generateToken({
      email: user.User_Email,
      role: user.User_Role,
    });

    // Determine table
    let tableName = "";
    switch (user.User_Role.toLowerCase()) {
      case "admin":
        tableName = "System_Admin";
        break;

      case "labour":
        tableName = "Labours";
        break;

      case "client":
        tableName = "Clients";
        break;

      case "supervisor":
        tableName = "Supervisors";
        break;

      default:
        tableName = "";
    }

    let rows2 = [];

    if (tableName) {
      const [details] = await db.execute(
        `SELECT * FROM ${tableName} WHERE Email = ?`,
        [UserEmail],
      );

      rows2 = details;
    }

    let clientID = null;
    let supervisorID = null;

    // Client ID
    if (user.User_Role.toLowerCase() === "client") {
      const [clientRows] = await db.execute(
        "SELECT ID FROM Clients WHERE Email = ?",
        [UserEmail],
      );

      clientID = clientRows[0]?.ID || null;
       return {
         token,
         success: true,
         clientID,
         funame: user.User_Name,
         urole: user.User_Role,
         uemail: user.User_Email,
         uaddr: rows2[0]?.Address || "Not Set",
         uphone: rows2[0]?.Phone || "Not Set",
         profileimgpath: rows2[0]?.profileImgPath || null,
         message: "Login Successful",
       };
    }

    // Supervisor ID
    if (user.User_Role.toLowerCase() === "supervisor") {
      const [supRows] = await db.execute(
        "SELECT ID FROM Supervisors WHERE Email = ?",
        [UserEmail],
      );

      supervisorID = supRows[0]?.ID || null;

       return {
         token,
         success: true,
         supervisorID,
         funame: user.User_Name,
         urole: user.User_Role,
         uemail: user.User_Email,
         uaddr: rows2[0]?.Address || "Not Set",
         uphone: rows2[0]?.Phone || "Not Set",
         profileimgpath: rows2[0]?.profileImgPath || null,
         message: "Login Successful",
       };
      
    }

    if (user.User_Role.toLowerCase() === "admin") {
      return {
        token,
        success: true,
        funame: user.User_Name,
        urole: user.User_Role,
        uemail: user.User_Email,
        uaddr: rows2[0]?.Address || "Not Set",
        uphone: rows2[0]?.Phone || "Not Set",
        profileimgpath: rows2[0]?.profileImgPath || null,
        message: "Login Successful",
      };
    }

    if (user.User_Role.toLowerCase() === "labour") {

        const [labRows] = await db.execute(
          "SELECT ID FROM labours WHERE Email = ?",
          [UserEmail],
        );

        let LabourID = labRows[0]?.ID || null;
      return {
        token,
        success: true,
        LabourID,
        funame: user.User_Name,
        urole: user.User_Role,
        uemail: user.User_Email,
        uaddr: rows2[0]?.Address || "Not Set",
        uphone: rows2[0]?.Phone || "Not Set",
        profileimgpath: rows2[0]?.profileImgPath || null,
        message: "Login Successful",
      };
    }
  } catch (err) {
    console.error("Login Error:", err);

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  } finally {
    if (db) {
      await db.end();
    }
  }
}
