    import mysql from "mysql2/promise";
    import { db_details } from "./dbconfig.js";
    import { CreateLabourId, CreateWageId, CreateUserId , PasswordGenerator} from "./UserIDGenerator.js";
import bcrypt from "bcrypt";
import fs from "fs";

    const AddLabourHandlerFunction = async (
    LabName,
    LabEmail,
    LabContact,
    LabAddr,
    LabWage,
    LabGen,
    Labdob,
    LabAccess,
    filepath
    ) => {

        console.log("name: " ,LabName);
        
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
    await db.beginTransaction();
    try{
        let [res] = await db.execute(`insert into ${table} (ID , Name , Email, Phone, Address, profileImgPath, gender, dob) values (?, ?, ?, ? ,? ,? ,?, ?)`, [labourID, LabName, LabEmail, LabContact, LabAddr, filepath, LabGen, Labdob]);
        
        let [res2] = await db.execute(`insert into ${table2} (wageId, LabourID, wages) values (? , ?, ?)`,[WageID, labourID, LabWage]);

        if(LabAccess){
            const userId = CreateUserId();
            const password = PasswordGenerator();
            console.log(password);
            
            const saltrounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltrounds);
            const role = 'labour';
            let [res3] = await db.execute(
        "INSERT INTO users (User_ID, User_Name, User_Email, User_Pass, User_Role) values(?, ?, ?, ?, ?)",[userId, LabName, LabEmail,hashedPassword,  role]); 
        }

       await db.commit();

       
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