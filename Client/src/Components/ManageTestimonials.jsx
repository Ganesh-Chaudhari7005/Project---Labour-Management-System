import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
export default function AdminTestimonials() {
  const [form, setForm] = useState({
    name: "",
    message: "",
    rating: 5,
  });

  const [data, setData] = useState([]);

  // FETCH DATA
 const fetchTestimonials = async () => {
   try {
     const res = await fetch(`${ApiRoute}testimonials`);

     if (!res.ok) {
       throw new Error("Fetch failed");
     }

     const json = await res.json();
     setData(json);
   } catch (error) {
     toast.error("Failed to load testimonials");
   }
 };
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ADD
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${ApiRoute}add-testimonials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      throw new Error("Failed to add testimonial");
    }

    setForm({ name: "", message: "", rating: 5 });

    toast.success("Testimonial added successfully");

    fetchTestimonials();
  } catch (error) {
    toast.error("Something went wrong while adding");
  }
};
  // DELETE
const handleDelete = async (id) => {
  try {
    const res = await fetch(`${ApiRoute}testimonials/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    toast.success("Deleted successfully");

    fetchTestimonials();
  } catch (error) {
    toast.error("Failed to delete testimonials");
  }
};

  return (
    <div className="tx9-admin-root">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="tx9-admin-card">
        <h2 className="tx9-title">Manage Testimonials</h2>

        {/* FORM */}
        <form className="tx9-form" onSubmit={handleSubmit}>
          <input
            className="tx9-input"
            placeholder="Customer Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <textarea
            className="tx9-textarea"
            placeholder="Customer Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />

          <select
            className="tx9-select"
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} Star
              </option>
            ))}
          </select>

          <button className="tx9-btn">Add Testimonial</button>
        </form>

        {/* TABLE */}
        <div className="tx9-table-wrapper">
          <table className="tx9-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Message</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.message}</td>
                  <td>{"⭐".repeat(item.rating)}</td>
                  <td>
                    <button
                      className="rounded logoutbtn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td colSpan="4" className="tx9-empty">
                    No testimonials found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* <ToastContainer position="top-right" autoClose={2000} /> */}
    </div>
  );
}
