import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
import { CreateClientId, CreateProjectID , CreateUserId , PasswordGenerator} from "./UserIDGenerator.js";
import bcrypt from "bcrypt";
export const HandleCreateProject = async (prjdata) => {
  let db;
  const ProjectDetails = prjdata.finalData;
  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    console.log("Failed to Connect Database", err);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  console.log("prjdata: ", ProjectDetails);

  try {
    await db.beginTransaction();

    let clientid = CreateClientId();
    db.execute(
      `insert into Clients (ID, Name , Email , Phone,Address, profileImgPath) values (?, ?, ?, ?, ?, ?)`,
      [
        clientid,
        ProjectDetails.clientName,
        ProjectDetails.clientEmail,
        ProjectDetails.clientContact,
        ProjectDetails.clientAddress,
        ProjectDetails.clientImage,
      ],
    );

    let projectID = CreateProjectID();
    await db.execute(
      `Insert into Projects (id, client_id, project_name, work_duration, builtup_rate, site_address) values(? , ? , ? , ? , ? , ?)`,
      [
        projectID,
        clientid,
        ProjectDetails.ProjectName,
        ProjectDetails.WorkDuration,
        ProjectDetails.BuiltupRate,
        ProjectDetails.SiteAddress,
      ],
    );

    for (const workdata of ProjectDetails.works) {
      await db.execute(
        `INSERT INTO project_status (project_id, work_type, work_status) VALUES (?, ?, ?)`,
        [projectID, workdata, "Pending"],
      );
    }


    if (ProjectDetails.systemAccess === true){
        let Userid = CreateUserId();
        let  Userpassword = PasswordGenerator();

        const saltrounds = 10;
        const hashedPassword = await bcrypt.hash(Userpassword, saltrounds);
        await db.execute(
          `Insert into users (User_ID, User_Name, User_Email, User_Pass, User_Role, profileImgPath)values(? ,?, ?, ?, ?, ?)`,
          [
            Userid,
            ProjectDetails.clientName,
            ProjectDetails.clientEmail,
            hashedPassword,
            "Client",
            ProjectDetails.clientImage
          ],
        );
    }
    
    await db.commit();

    return{
      success : true,
      message : "Project Created Successfully"
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Failed to Create Project",
    };
  }
};
