import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig.js";
import Swal from "sweetalert2";

export default function ServiceRequestsAdmin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const isNewRequest = (time) => {
    const now = new Date();
    const requestTime = new Date(time);
    const diffInMs = now - requestTime;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours <= 48;
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${ApiRoute}get-service-requests`);
      const data = await res.json();

      if (data.success) {
        setRequests(data.data);
      } else {
        toast.error("Failed to load requests");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "swal-small",
        title: "swal-title-small",
        icon: "swal-icon-small",
        confirmButton: "cust-swal-delbtn",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${ApiRoute}delete-service-request/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Request deleted");
        setRequests((prev) => prev.filter((item) => item.RequestID !== id));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ToastContainer />

        <div className="pg-container overflow-x-hidden">
          <br />
          <h2 className="pg-title">Service Requests</h2>

          {/* 🔄 Loading */}
          {loading ? (
            <div className="text-center mt-5">
              <p>Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            /* ✨ Empty State */
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="empty-icon"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6c757d"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                  <rect x="13" y="3" width="8" height="8" rx="1" />
                  <rect x="3" y="13" width="8" height="8" rx="1" />
                  <rect x="13" y="13" width="8" height="8" rx="1" />
                </svg>
              </motion.div>

              <h4>No Service Requests Yet</h4>
              <p>
                Looks quiet here... once users submit requests, they’ll show up
                here.
              </p>

              <button className="rounded mt-3" onClick={fetchRequests}>
                Refresh
              </button>
            </motion.div>
          ) : (
            /* ✅ Data Grid */
            <div className="row mt-4">
              {requests.map((item) => (
                <div className="col-lg-6 col-xl-4 mb-4" key={item.RequestID}>
                  <div className="premium-card">
                    <div className="pc-header">
                      <div className="pc-avatar">
                        {item.PersonName.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h6 className="pc-name">
                          {item.PersonName}

                          {isNewRequest(item.RequestTime) && (
                            <span className="new-badge">NEW</span>
                          )}
                        </h6>

                        <span className="pc-meta">
                          #{item.RequestID} •{" "}
                          {new Date(item.RequestTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="pc-divider"></div>

                    <div className="pc-grid">
                      <div>
                        <span>Email</span>
                        <p>{item.PersonEmail}</p>
                      </div>
                      <div>
                        <span>Mobile</span>
                        <p>{item.PersonMobile}</p>
                      </div>
                      <div>
                        <span>City</span>
                        <p>{item.PersonCity}</p>
                      </div>
                      <div>
                        <span>Pincode</span>
                        <p>{item.Pincode}</p>
                      </div>
                    </div>

                    <div className="pc-address">{item.PersonAddress}</div>

                    <div className="pc-requirement">
                      <span>Requirement</span>
                      <p>
                        {item.Requirement.length > 120
                          ? item.Requirement.slice(0, 120) + "..."
                          : item.Requirement}
                      </p>
                    </div>

                    <div className="pc-footer">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.RequestID)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
