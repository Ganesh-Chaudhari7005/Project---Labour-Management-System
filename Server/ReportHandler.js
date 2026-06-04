import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export const getReportData = async (data) => {
  let db;

  try {
    db = await mysql.createConnection(db_details);

    const { labour, type, month, fromDate, toDate, LabourType } = data;
    console.log("heee", data);

    let where = "WHERE 1=1";
    let params = [];

    // 🔹 Labour filter
    if (labour) {
      where += " AND attendance.labour_id = ?";
      params.push(labour);
    }

    // 🔹 Filter type
    if (type === "current") {
      where += `
        AND MONTH(date) = MONTH(CURRENT_DATE()) 
        AND YEAR(date) = YEAR(CURRENT_DATE())
      `;
    }

    if (type === "month" && month) {
      where += " AND DATE_FORMAT(date, '%Y-%m') = ?";
      params.push(month);
    }

    if (type === "range" && fromDate && toDate) {
      where += " AND date BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    // 🔹 Fetch records (format date directly in SQL)

    let Query;
    if (LabourType.toLowerCase() === "helper") {
      Query = `
      SELECT 
        DATE_FORMAT(attendance.date, '%Y-%m-%d') AS date,
        attendance.labour_id,
        attendance.status,
        attendance.advance,
        attendance.Day_Total,
        attendance.WorkDoneHelper,
        labours.Name,
        projects.ProjectName
      FROM attendance
      JOIN labours ON labours.ID = attendance.labour_id
      LEFT JOIN projects ON projects.ProjectID = attendance.ProjectID
      ${where}
      ORDER BY date DESC
      `;
    } else if (LabourType.toLowerCase() === "misteri") {
      Query = `
  SELECT
    DATE_FORMAT(attendance.date, '%Y-%m-%d') AS date,
    attendance.labour_id,
    attendance.status,
    attendance.advance,
    attendance.Day_Total,
    attendance.Work_Done,
    attendance.WorkTypeID,
    work_details.WorkName,
    labours.Name,
    projects.ProjectName
  FROM attendance
  JOIN labours
    ON labours.ID = attendance.labour_id
  LEFT JOIN projects
    ON projects.ProjectID = attendance.ProjectID
  LEFT JOIN work_details
    ON work_details.WorkID = attendance.WorkTypeID
  ${where}
  ORDER BY attendance.date DESC
`;
    }


  const [rows] = await db.execute(Query, params);

  let total = 0;
  let advanceTotal = 0;

  rows.forEach((r) => {
    total += Number(r.Day_Total || 0);
    advanceTotal += Number(r.advance || 0);
  });
    let previousBalance = 0;

    if (type === "current") {
      if (type === "current" && labour) {
        const [prevRows] = await db.execute(
          `
    SELECT
      COALESCE(SUM(Day_Total),0) AS totalWages,
      COALESCE(SUM(advance),0) AS totalAdvance
    FROM attendance
    WHERE labour_id = ?
      AND date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `,
          [labour],
        );

        const totalWages = Number(prevRows[0].totalWages || 0);
        const totalAdvance = Number(prevRows[0].totalAdvance || 0);

        // Positive => labour has money to receive
        // Negative => labour has taken excess advance
        previousBalance = totalWages - totalAdvance;
      }

      let pastFlag = previousBalance > 0 ? "Add" : "Minus";

       const summary = {
         days: rows.length,
         total,
         previousBalance,
         pastFlag,
         advance: advanceTotal,
         balance: total - advanceTotal,
       };

       return {
         success: true,
         records: rows,
         summary,
       };
    }

    // 🔹 Summary


    const summary = {
      days: rows.length,
      total,
      advance: advanceTotal,
      balance: total - advanceTotal,
    };

    return {
      success: true,
      records: rows,
      summary,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      message: "Database error",
    };
  } finally {
    if (db) await db.end();
  }
};
