import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

export const getReportData = async (data) => {
  let db;

  try {
    db = await mysql.createConnection(db_details);

    const { labour, type, month, fromDate, toDate } = data;

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
    const query = `
  SELECT 
    DATE_FORMAT(attendance.date, '%Y-%m-%d') AS date,
    attendance.labour_id,
    attendance.status,
    attendance.advance,
    attendance.Day_Total,
    attendance.Work_Done,
    labours.Name,
    projects.ProjectName
  FROM attendance
  JOIN labours ON labours.ID = attendance.labour_id
  LEFT JOIN projects ON projects.ProjectID = attendance.ProjectID
  ${where}
  ORDER BY date DESC
`;

    const [rows] = await db.execute(query, params);

    // 🔹 Summary
    let total = 0;
    let advanceTotal = 0;

    rows.forEach((r) => {
      total += Number(r.Day_Total || 0);
      advanceTotal += Number(r.advance || 0);
    });

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
