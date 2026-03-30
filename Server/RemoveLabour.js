
import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";
async function RemoveLabour(removeLabouremail) {
  let db;
  try {
    db = await mysql.createConnection(db_details);
  } catch (err) {
    console.log("Failed to Connect Database");
    return {
      success: false,    
      message: "Something went wrong. Please try again later.",
    };
  }
  
  console.log("emial in func" , removeLabouremail);

  let table = "labours";
  let LabourIDRow;
  let checkLabourExists;
  let deleteResult;
  try{
  [checkLabourExists] = await db.execute(`select * from ${table} where Email = ?`, [removeLabouremail]);

  if(checkLabourExists.length === 0){
    console.log("Labour Does not exists")
    return {
      success: false,
      message: "Labour Does not Exists",
    };
  }else{
     [LabourIDRow] = await db.execute(
       `select ID from labours where Email = ?`,
       [removeLabouremail],
     );

     let LabourId = LabourIDRow[0].ID;
console.log(LabourId);

     [deleteResult] = await db.execute(`Delete from ${table} where ID=?`,[LabourId]);

     if(deleteResult.affectedRows === 1){
      console.log("Labour Deleted Successfully");
      
        return {
          success: true,
          message: "Labour Removed Successfully.",
        };
     }else{
        return {
          success: false,
          message: "Server Error..!, Failed to Remove Labour",
        };
     }
     console.log(deleteResult);
     

    }    
  }catch(err){
    console.log("Error while fetching labour ID",err);
  }finally{
    if(db) await db.end();
  }

}

export default RemoveLabour;
