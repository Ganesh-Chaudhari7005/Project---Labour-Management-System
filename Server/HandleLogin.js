  import { db_details } from "./dbconfig.js";
  import mysql from "mysql2/promise";
  import generateToken from "./utils/jwt.js";
import bcrypt from 'bcrypt';
  export async function HandleLogin(UserEmail, Pass) {
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
    let rows2;
    let clientID;
    try {
      [rows] = await db.execute(
        `Select * from Users where User_Email=?`,
        [UserEmail],
      );

      let userRole = rows[0].User_Role;
      let clientEmail = rows[0].User_Email;
      console.log(clientEmail);
      
      if(userRole === 'Client'){
        let [getClientId] = await db.execute(`Select ID from clients where Email=?`,[clientEmail]);
 
         clientID = getClientId[0].ID;
        console.log("IDis",getClientId);
        
      }
      
      
    } catch (err) {
      console.log("Failed to Fetch Details");
      console.log(err);
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    } 

console.log("rows:", rows[0].User_Pass);

    if (rows.length > 0) {

      let userDBPass = rows[0].User_Pass;
  
        console.log("dbpass : ", userDBPass);
        
        const isMatch = await bcrypt.compare(Pass , userDBPass);

        if (isMatch) {
          const token = generateToken({
            email: rows[0].User_Email,
            role: rows[0].User_Role,
          });
          console.log(rows[0]);
          let temptable;
          if (rows[0].User_Role === "Admin") {
            temptable = "System_Admin";
          } else if (rows[0].User_Role === "Labour" || rows[0].User_Role === "labour") {
            temptable = "Labours";
          } else if (rows[0].User_Role === "Client") {
            temptable = "Clients";
          } else if (rows[0].User_Role === "Supervisor") {
            temptable = "Supervisors";
          }
          try {
            console.log(temptable);
            [rows2] = await db.execute(
              `Select * from ${temptable} where Email = ?`,
              [UserEmail]
            );
          } catch (err) {
            console.log("Error in rows2", err);
          } finally {
            if (db) await db.end();
          }
          // console.log("ProfileImage is : ", rows2[0].profileImgPath);
          // console.log("Address is ", rows2[0].Address)
          console.log("Test det: ", rows2);

          return {
            token,
            success: true,
            clientID : clientID,
            funame: rows[0].User_Name,
            urole: rows[0].User_Role,
            uemail: rows[0]?.User_Email,
            uaddr: rows2[0]?.Address || "Not Set",
            uphone: rows2[0]?.Phone || "Not Set",
            profileimgpath: rows2[0]?.profileImgPath,
            // databaseUserName: rows[0].username,
            message: "Login Successfull",
          };
        } else {
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
