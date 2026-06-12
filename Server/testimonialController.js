import { pool } from "./Sharedpool.js";

// GET
export const getTestimonials = async (req, res) => {
  try {

    const [rows] = await pool.execute(
      "SELECT * FROM testimonials  ORDER BY id DESC",
    );

    res.json(rows); 
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching testimonials" });
  } 
};

// ADD
export const addTestimonial = async (req, res) => {
  const { name, message, rating } = req.body;

  try {

    await pool.execute(
      "INSERT INTO testimonials (name, message, rating) VALUES (?, ?, ?)",
      [name, message, rating || 5],
    );

    res.json({ message: "Added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding testimonial" });
  } 
}
// DELETE
export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {

    await pool.execute("DELETE FROM testimonials WHERE id=?", [id]);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting" });
  }
};
