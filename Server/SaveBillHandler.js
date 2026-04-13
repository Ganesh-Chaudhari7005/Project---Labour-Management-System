import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export async function SaveBill(data, filepath) {
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
  console.log(projectId);
  console.log(totalAmount);
  console.log(details);

  try {
    await db.beginTransaction();

    let [checkBillNo] = await db.execute(
      `select * from all_bills where ProjectID=?`,
      [projectId],
    );

    let BillNumber;

    if (checkBillNo.length === 0) {
      BillNumber = 1;
    }else{
      BillNumber = checkBillNo.length + 1;
    }

 const [insertStatus] = await db.execute(
   `INSERT INTO all_bills (BillNo, ProjectID, TotalAmount, PDFPath)
   VALUES (?, ?, ?, ?)`,
   [BillNumber, projectId, totalAmount, filepath],
 );

 let billId = insertStatus.insertId;

 console.log("Correct BillID is:", billId);


    console.log("billid used is", billId);

    for (let work of details) {
      let [insertWork] = await db.execute(
        `insert into bill_details(BillID,WorkType,Area,Rate,Amount) values(?,?,?,?,?)`,
        [billId, work.name, work.area, work.rate, work.total],
      );
    }
    await db.commit();
  } catch (err) {
    await db.rollback();
    console.log(err);
  } finally {
    if (db) await db.end();
  }
}
