import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
import { CreateClientId, CreateProjectID , CreateUserId , PasswordGenerator} from "./UserIDGenerator.js";
import bcrypt from "bcrypt";
export const HandleCreateProject = async (prjdata) => {
  let db;
  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    console.log("Failed to Connect Database", err);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  
  const {
    clientName,
    clientEmail,
    clientContact,
    clientImage,
    clientAddress,
    systemAccess,
    isGSTRegistered,
    gstin,
    ProjectName,
    Startdate,
    Enddate,
    SiteAddress,
  } = prjdata;

  const {works} = prjdata;
  
  console.log(clientName);
  console.log(works);

 try {
   await db.beginTransaction();

   let [existing] = await db.query("SELECT ID FROM clients WHERE Email = ?", [
     clientEmail,
   ]);
   let clientID;

   if (existing.length > 0) {
     clientID = existing[0].ID;
   } else {
     clientID = CreateClientId();
     await db.query(
       `INSERT INTO clients (ID, Name, Email, Phone, Address, gstin)
         VALUES (?, ?, ?, ?, ?, ?)`,
       [
         clientID,
         clientName,
         clientEmail,
         clientContact,
         clientAddress,
         gstin || null,
       ],
     );
   }

   let projectID = CreateProjectID();
   await db.query(
     `INSERT INTO projects 
      (ProjectID, ClientID, ProjectName, StartDate, EndDate, Address, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
     [
       projectID,
       clientID,
       ProjectName,
       Startdate,
       Enddate || null,
       SiteAddress,
       "Pending",
     ],
   );

   for (const key in works) {
     const work = works[key];

     await db.query(
       `INSERT INTO Work_Details 
        (ProjectID, WorkName, TotalArea, Rate, CompletedArea)
        VALUES (?, ?, ?, ?, ?)`,
       [
         projectID,
         work.label || key,
         work.total,
         work.rate,
         0, // initially 0
       ],
     );
   }

   if (systemAccess === true) {
     let Userid = CreateUserId();
     let Userpassword = PasswordGenerator();

     const saltrounds = 10;
     const hashedPassword = await bcrypt.hash(Userpassword, saltrounds);
     await db.execute(
       `Insert into users (User_ID, User_Name, User_Email, User_Pass, User_Role)values(? ,?, ?, ?, ?)`,
       [Userid, clientName, clientEmail, hashedPassword, "Client"],
     );
   }

   await db.commit();
   return {
     success: true,
     message: "Project created successfully",
   };
 } catch (err) {
   await db.rollback();
   console.error(err);

   return {
     success: false,
     message: "Error creating project",
   };
 } finally {
   if (db) await db.end();
 }}