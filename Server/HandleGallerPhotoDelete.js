import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

async function RemoveGalleryImage(photoID) {
  console.log(photoID);

  let db;

  try {
    db = await mysql.createConnection(db_details);

    const [rows] = await db.execute(
      `delete from photogallery where photoid=?`,
      [photoID],
    );

    console.log(rows);

    if (rows.affectedRows === 1) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
      };
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
    };
  } finally {
    if (db) await db.end();
  }
}

export default RemoveGalleryImage;
