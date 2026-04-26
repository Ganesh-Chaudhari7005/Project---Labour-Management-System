// HandlePhotoUpload.js

import { db_details } from "./dbconfig.js";
import mysql from "mysql2/promise";

export const handlePhotoUpload = async (filePath) => {
  let connection;

  try {
    connection = await mysql.createConnection(db_details);

    const sql = "INSERT INTO photogallery (uploadpath) VALUES (?)";

    const [result] = await connection.execute(sql, [filePath]);

    return {
      success: true,
      message: "Photo uploaded successfully",
      id: result.insertId,
      path: filePath,
    };
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) await connection.end(); // 🔥 important
  }
};
