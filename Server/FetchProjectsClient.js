import mysql from 'mysql2/promise';
import { db_details } from './dbconfig.js';

async function FetchProjects(clientID){
    
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

    let rows;

    try{
        [rows] = await db.execute("SELECT * FROM projects where ClientID=?",[clientID]);

         return rows;
    }catch(err){
        console.log(err);
    }finally{
        if (db) await db.end();
    }
} 

export default FetchProjects;