import mysql from 'mysql2/promise';
import { db_details } from './dbconfig.js';

async function GetProjectDetails(id){
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
        [rows] = await db.execute(
          "SELECT * FROM projects where id=?",
          [id],
        );


        let clientId = rows[0].client_id;
        
        let clientDetails;

        [clientDetails] = await db.execute(`select * from clients where ID=?`,[clientId]);

        console.log(clientDetails);
        
        let FullDet = {
            projectdetails : rows[0],
            clientDetails : clientDetails[0]
        }
        
        console.log(FullDet);
         return FullDet;
    }catch(err){
        console.log(err);
    }finally{
        if (db) await db.end();
    }
} 

export default GetProjectDetails;