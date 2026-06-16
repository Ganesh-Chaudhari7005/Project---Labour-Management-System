
import mysql from 'mysql2/promise';
import { db_details } from './dbconfig.js';

async function GetCllientPendingBills(ClientId){
    
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

    try{
        let [PendingBills] = await db.execute(
          `
  SELECT
    all_bills.*,
    projects.ProjectName
  FROM all_bills
  JOIN projects
    ON projects.ProjectID = all_bills.ProjectID
  WHERE projects.ClientID = ?
    AND all_bills.send_to_client = 1
    AND all_bills.Status = 'Pending'
`,
          [ClientId],
        );

        if(PendingBills.length === 0){
            return{
                success : false,
                message : "No Pending Bills"
            }
        }else{
            
            console.log(PendingBills);

            return{
                success : true,
                Bills : PendingBills,
            }
        }
        
    }catch(err){
        console.log(err);
        
    }finally{
        if(db) await db.end();
    }
}

export default GetCllientPendingBills;