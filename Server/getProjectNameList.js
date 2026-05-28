import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

async function GetProjectNames(clientid) {
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
    let [GetList] = await db.execute(
      `SELECT ProjectID , ProjectName FROM projects WHERE ClientID=?`,
      [clientid],
    );

    return {
        success : true,
        ProjectDetails : GetList
    }
  } catch (err) {
    console.log(err);
  } finally {
    if(db) await db.end();
  }
}

export default GetProjectNames;
