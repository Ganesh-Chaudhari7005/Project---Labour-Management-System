import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

async function GetClietInfo_BillNo(projectid) {
  console.log("Biill no called");

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

  let BillNo;
  let [fetchBillNo] = await db.execute(
    `select * from all_bills where ProjectID=?`,
    [projectid],
  );

  if (fetchBillNo.length === 0) {
    BillNo = 1;
  } else {
    BillNo = fetchBillNo.length + 1;
  }

  const getClientIDQuery = `SELECT ClientID ,Address from projects where ProjectID=?`;
  const [getClientIDStatus] = await db.execute(getClientIDQuery, [projectid]);

  const ClientID = getClientIDStatus[0].ClientID;
  const SiteAddr = getClientIDStatus[0].Address;
  
  const getClientNameGSTQuery = `SELECT Name,gstin from clients where ID=?`;
  const [getClientNameGst] = await db.execute(getClientNameGSTQuery, [
    ClientID,
  ]);

  const ClientName = getClientNameGst[0].Name;
  return {
    success: true,
    BillNum: BillNo,
    Name : ClientName,
    Address : SiteAddr
  };
}

export default GetClietInfo_BillNo;
