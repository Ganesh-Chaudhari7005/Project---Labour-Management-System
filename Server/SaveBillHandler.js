import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export async function SaveBill(data, filepath){
    console.log("SaveBill called");
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

  const { projectId, totalAmount, details } = data;

try{
      await db.beginTransaction();

  let [checkBillNo] = await db.execute(
    `select * from all_bills where ProjectID=?`,[projectId]
  ); 


  let BillNumber = checkBillNo.length + 1;

  
  let [insertStatus] = await db.execute(
    `insert into all_bills(BillNo,ProjectID,TotalAmount,PDFPath) values(?,?,?,?)`,[BillNumber,projectId,totalAmount,filepath]
  );

  let [get_bill_id] = await db.execute(
    `select BillID from all_bills where BillNo=?`,[BillNumber]
  );
  
  let billId = get_bill_id[0].BillID;;
 
  console.log(billId);
   console.log(details);
   
  for (let work of details) {
    let [insertWork] = await db.execute(
      `insert into bill_details(BillID,WorkType,Area,Rate,Amount) values(?,?,?,?,?)`,
      [billId, work.name, work.area, work.rate,work.total],
    );
  }
await db.commit();

}catch(err){
    await db.rollback();
    console.log(err);
    
}finally{
    if(db) await db.end();
}
  
  
}