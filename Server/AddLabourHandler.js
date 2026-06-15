    import mysql from "mysql2/promise";
    import { db_details } from "./dbconfig.js";
    import { CreateLabourId, CreateWageId, CreateUserId , PasswordGenerator} from "./UserIDGenerator.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import SendMail from "./SendMail.js";

    const AddLabourHandlerFunction = async (
    LabName,
    LabEmail,
    LabContact,
    LabAddr,
    LabWage,
    LabGen,
    Labdob,
    LabAccess,
    filepath,
    LabType
    ) => {

        console.log("name: " ,LabName);
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
    const today = new Date().toISOString().split("T")[0];

    if (
        !LabName ||
        !LabEmail ||
        !LabContact ||
        !LabAddr ||
        !LabWage ||
        !LabGen ||
        !Labdob ||
        !LabAccess
    ) {
        return {
        success: false,
        message: "Fill Required Details",
        };
    } else if (LabContact.length > 10 || LabContact.length < 10) {
        return {
        success: false,
        message: "Enter a Valid Phone Number",
        };
    } else if (Labdob > today) {
        return {
        success: false,
        message: "Invalid Date",
        };
    } else if (LabWage === 0) {
        return {
        success: false,
        message: "Wage should be greater than 0",
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

    const table = 'labours';
    const table2 = 'wages';
    const tableusers = 'users';
    const labourID = CreateLabourId();
    const WageID = CreateWageId();
    let password;
    await db.beginTransaction();

    
    try{
        
        let [checkLabExists] = await db.execute(`select * from labours where Email = '${LabEmail}'`);

        console.log(checkLabExists);

        if(checkLabExists.length > 0){
                            console.log("Email exists");

            return{
                success : false,
                message : "Labour Already Exists"
            }
        }
        
        let [res] = await db.execute(`insert into ${table} (ID , Name , Email, Phone, Address, profileImgPath, gender, dob, LabType) values (?, ?, ?, ? ,? ,? ,?, ?, ?)`, [labourID, LabName, LabEmail, LabContact, LabAddr, filepath, LabGen, Labdob, LabType]);
        
        let [res2] = await db.execute(`insert into ${table2} (wageId, LabourID, wages) values (? , ?, ?)`,[WageID, labourID, LabWage]);

        if(LabAccess){
            const userId = CreateUserId();
            password = PasswordGenerator();
            console.log(password);
            
            const saltrounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltrounds);
            const role = 'labour';
            let [res3] = await db.execute(
        "INSERT INTO users (User_ID, User_Name, User_Email, User_Pass, User_Role) values(?, ?, ?, ?, ?)",[userId, LabName, LabEmail,hashedPassword,  role]); 
        }

       await db.commit();
            let MailSub = 'Access Granted'
            let mailMessage = `<h2 style="font-family : 'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif">You have been given access to Royal Enterprises Portal</h2>
                        <p>Login :<a href="http://192.168.31.208:5173/system-login" target="_blank">http://192.168.31.208:5173/</a></p>
                        <p>Password : ${password}</p>
                        `;
            SendMail(LabEmail, MailSub, mailMessage )
            return{
                success : true,
                message : "Labour Added Successfully"
            }
        
        
    }catch(err){
         await db.rollback();
              console.log(err);
        return {
        success: false,
        message: "Server Error",
        };   
    }finally{
        if(db) await db.end();
    }
    };


    export default AddLabourHandlerFunction;