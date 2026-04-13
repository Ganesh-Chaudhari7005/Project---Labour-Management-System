
import mysql from 'mysql2/promise';
import { db_details } from './dbconfig.js';

async function GetPastBills(projectid){
    
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
console.log("projectid is", projectid);

    try{
        [rows] = await db.execute("SELECT * FROM all_bills where ProjectID=?", [projectid]);

        if(rows.length === 0){
            return{
                success :false,
                message : "No Bills Generated yet"
            }
        }else{
            console.log(rows);
            return{
                success : true,
                Bills : rows
            }
        }
    }catch(err){
        console.log(err);
    }finally{
        if (db) await db.end();
    }
} 

export default GetPastBills;