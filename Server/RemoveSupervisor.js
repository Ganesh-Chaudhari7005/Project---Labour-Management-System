import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

async function RemoveSupervisor(removeSupervisorEmail) {
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

  console.log("email in func", removeSupervisorEmail);

  let table = "supervisors";

  let SupervisorIDRow;
  let checkSupervisorExists;
  let deleteResult;

  try {
    [checkSupervisorExists] = await db.execute(
      `SELECT * FROM ${table} WHERE Email = ?`,
      [removeSupervisorEmail],
    );

    if (checkSupervisorExists.length === 0) {
      console.log("Supervisor Does not exist");

      return {
        success: false,
        message: "Supervisor Does not Exist",
      };
    } else {
      [SupervisorIDRow] = await db.execute(
        `SELECT ID FROM supervisors WHERE Email = ?`,
        [removeSupervisorEmail],
      );

      let SupervisorId = SupervisorIDRow[0].ID;

      console.log(SupervisorId);

      [deleteResult] = await db.execute(
        `DELETE FROM ${table} WHERE ID = ?`,
        [SupervisorId],
      );

      if (deleteResult.affectedRows === 1) {
        console.log("Supervisor Deleted Successfully");

        return {
          success: true,
          message: "Supervisor Removed Successfully.",
        };
      } else {
        return {
          success: false,
          message: "Server Error..!, Failed to Remove Supervisor",
        };
      }
    }
  } catch (err) {
    console.log("Error while removing supervisor", err);

    if (err.code === "ER_ROW_IS_REFERENCED_2") {
      return {
        success: false,
        message:
          "Cannot remove supervisor because records are linked to this supervisor.",
      };
    }

    return {
      success: false,
      message: "Something went wrong",
    };
  } finally {
    if (db) await db.end();
  }
}

export default RemoveSupervisor;
