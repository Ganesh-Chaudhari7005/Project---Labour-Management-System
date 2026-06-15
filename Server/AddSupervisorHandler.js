import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
import {
  CreateSupervisorId,
  CreateSalaryId,
  CreateUserId,
  PasswordGenerator,
} from "./UserIDGenerator.js";

import bcrypt from "bcrypt";
import SendMail from "./SendMail.js";

const AddSupervisorHandler = async (
  SupervisorName,
  SupervisorEmail,
  SupervisorContact,
  SupervisorAddress,
  SupervisorSalary,
  SupervisorAccess,
  filepath,
) => {
  console.log("Supervisor Name:", SupervisorName);

  if (
    !SupervisorName ||
    !SupervisorEmail ||
    !SupervisorContact ||
    !SupervisorAddress ||
    !SupervisorSalary
  ) {
    return {
      success: false,
      message: "Fill Required Details",
    };
  } else if (SupervisorContact.length > 10 || SupervisorContact.length < 10) {
    return {
      success: false,
      message: "Enter a Valid Phone Number",
    };
  } else if (Number(SupervisorSalary) <= 0) {
    return {
      success: false,
      message: "Salary should be greater than 0",
    };
  }

  let db;

  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    return {
      success: false,
      message: "Failed to connect database",
    };
  }

  const supervisorTable = "supervisors";
  const salaryTable = "salary";
  const usersTable = "users";

  const SupervisorID = CreateSupervisorId();

  let password = "";

  await db.beginTransaction();

  try {
    // Check if supervisor already exists
    let [checkSupervisor] = await db.execute(
      `SELECT * FROM ${supervisorTable} WHERE Email = ?`,
      [SupervisorEmail],
    );

    if (checkSupervisor.length > 0) {
      return {
        success: false,
        message: "Supervisor Already Exists",
      };
    }

    // Insert supervisor
    await db.execute(
      `INSERT INTO ${supervisorTable}
      (
        ID,
        Name,
        Email,
        Phone,
        Address,
        profileImgPath
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        SupervisorID,
        SupervisorName,
        SupervisorEmail,
        SupervisorContact,
        SupervisorAddress,
        filepath,
      ],
    );

    // Insert salary
    await db.execute(
      `INSERT INTO ${salaryTable}
      (
        SupervisorID,
        Salary
      )
      VALUES (?, ?)`,
      [SupervisorID, SupervisorSalary],
    );

    // Create login access
    if (SupervisorAccess) { 
      const UserID = CreateUserId();

      password = PasswordGenerator();
      console.log("pass: ", password);
      
      const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const role = "supervisor";

      await db.execute(
        `INSERT INTO ${usersTable} 
        (
          User_ID,
          User_Name,
          User_Email,
          User_Pass,
          User_Role
        )
        VALUES (?, ?, ?, ?, ?)`,
        [UserID, SupervisorName, SupervisorEmail, hashedPassword, role],
      );
    }

    await db.commit();

    // Send mail if access is enabled
    if (SupervisorAccess) {
      let MailSub = "Access Granted";

      let mailMessage = `
      <h2 style="font-family : 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif">
        You have been given access to Royal Enterprises Portal
      </h2>

      <p>
        Login :
        <a href="http://192.168.31.208:5173/system-login" target="_blank">
          http://192.168.31.208:5173/
        </a>
      </p>

      <p>Password : ${password}</p>
      `;

      SendMail(SupervisorEmail, MailSub, mailMessage);
    }

    return {
      success: true,
      message: "Supervisor Added Successfully",
    };
  } catch (err) {
    await db.rollback();

    console.log(err);

    return {
      success: false,
      message: "Server Error",
    };
  } finally {
    if (db) await db.end();
  }
};

export default AddSupervisorHandler;
