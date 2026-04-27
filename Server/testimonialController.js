import mysql from "mysql2/promise";
import { db_details } from "./dbconfig.js";

// GET
export const getTestimonials = async (req, res) => {
  try {
    const db = await mysql.createConnection(db_details);

    const [rows] = await db.execute(
      "SELECT * FROM testimonials  ORDER BY id DESC",
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching testimonials" });
  } finally {
    if (db) await db.end();
  }
};

// ADD
export const addTestimonial = async (req, res) => {
  const { name, message, rating } = req.body;

  try {
    const db = await mysql.createConnection(db_details);

    await db.execute(
      "INSERT INTO testimonials (name, message, rating) VALUES (?, ?, ?)",
      [name, message, rating || 5],
    );

    res.json({ message: "Added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding testimonial" });
  } finally {
    if (db) await db.end();
  }
};

// DELETE
export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  try {
    const db = await mysql.createConnection(db_details);

    await db.execute("DELETE FROM testimonials WHERE id=?", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting" });
  }finally{
    if(db) await db.end();
  }
};

