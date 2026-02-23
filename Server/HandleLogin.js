import { db_details } from "./dbconfig.js";
import mysql from "mysql2/promise";
export async function HandleLogin(Uname, Pass) {
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
  try {
    [rows] = await db.execute(
      `Select * from users where username=? and password=?`,
      [Uname, Pass],
    );
  } catch (err) {
    console.log("Failed to Fetch Details");
    console.log(err);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  } finally {
    if (db) await db.end();
  }
  if (rows.length > 0) {
    if (Uname == rows[0].username && Pass == rows[0].password) {
      console.log(rows[0]);
      
      return {
        success: true,
        funame: rows[0].runame,
        urole: rows[0].role,
        uemail : rows[0].email,
        uaddr : rows[0].address,
        uphone : rows[0].phone,
        databaseUserName : rows[0].username,
        message: "Login Successfull",
      };
    }else{
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
