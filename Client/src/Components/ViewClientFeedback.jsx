import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ApiRoute } from "./ApiConfig";
import Swal from "sweetalert2";
import {toast, ToastContainer} from "react-toastify";
export default function ViewClientFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${ApiRoute}view-client-feedback`);

      const data = await response.json();

      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);


const deleteFeedback = async (feedbackId) => {
  const result = await Swal.fire({
    title: "Delete Feedback?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, Delete",
  });

  if (!result.isConfirmed) return;

  try {
    const response = await fetch(`${ApiRoute}delete-feedback/${feedbackId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.success) {
      setFeedbacks((prev) =>
        prev.filter((item) => item.FeedbackID !== feedbackId),
      );

      toast.success("Feedback Deleted Successfully");
    } else {
      toast.error("Failed to Delete Feedback");
    }
  } catch (error) {
    console.error(error);

    toast.error("Failed to Delete Feedback. Try Again Later");
  }
};

const addToTestimonials = async (feedback) => {
  try {
    const result = await Swal.fire({
      title: "Add to Testimonials?",
      text: "This feedback will be displayed publicly on the website.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Add",
    });

    if (!result.isConfirmed) return;

    const response = await fetch(`${ApiRoute}add-testimonial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: feedback.ClientName,
        message: feedback.Feedback,
        rating: feedback.Rating,
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Feedback added to testimonials.");
    } else {
      toast.error("Failed to add testimonial.");
    }
  } catch (error) {
    console.error(error);

    toast.error("Failed to add testimonial.");
  }
};

const filteredFeedbacks =
  ratingFilter === "all"
    ? feedbacks
    : feedbacks.filter((item) => Number(item.Rating) === Number(ratingFilter));
  return (
    <motion.div
      className="container py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ToastContainer />
      <div>
        <div className="card-header">
          <h4 className="mb-5">Client Feedback</h4>
        </div>

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="mb-0">
              Total Feedbacks:
              <span className="badge bg-primary ms-2">
                {filteredFeedbacks.length}
              </span>
            </h5>

            <div className="d-flex align-items-center gap-2">
              <label className="fw-bold mb-0">Filter Rating:</label>

              <select
                className="form-select"
                style={{ width: "150px" }}
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-4">Loading feedback...</div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="alert alert-info mb-0">
              No feedback records found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table  table-bordered align-middle">
                <thead>
                  <tr>
                    <th className="tbl-head">Sr. No.</th>
                    <th className="tbl-head">Site Name</th>
                    <th className="tbl-head">Client Name</th>
                    <th className="tbl-head">Feedback</th>
                    <th className="tbl-head">Rating</th>
                    <th className="tbl-head">Action</th>
                    <th className="tbl-head">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFeedbacks.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.ProjectName || "-"}</td>
                      <td>{item?.ClientName || "-"}</td>
                      <td>{item?.Feedback || "-"}</td>
                      <td className="d-flex align-items-center gap-2">
                        <span className="fs-5">{"⭐".repeat(item.Rating)}</span>
                        <div className="mt-2 small text-muted">
                          {item?.Rating || 0}/5
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn fd-rm-btn btn-sm"
                          onClick={() => deleteFeedback(item.FeedbackID)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-fd-add btn-sm"
                          onClick={() => addToTestimonials(item)}
                        >
                          Add to Testimonials
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
