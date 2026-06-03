import React, { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig.js";
import { uploadUrl } from "../uploadConfig";
import { motion } from "framer-motion";
import { useApi } from "./ApiCaller.js";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

export default function ViewAllSupervisors() {
  const callapi = useApi();

  const [allSupervisors, setAllSupervisors] = useState([]);

  const [currentSupName, setSupName] = useState("");
  const [currentSupEmail, setSupEmail] = useState("");
  const [currentSupPhone, setSupPhone] = useState("");
  const [currentSupImg, setSupImg] = useState("");
  const [currentSupAddr, setSupAddr] = useState("");
const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [search, setSearch] = useState("");


  const FetchSupervisorsFromDB = async () => {
    let reqSup = await fetch(`${ApiRoute}fetch-supervisors`);

    console.log(reqSup.status);

    let res = await reqSup.json();

    setAllSupervisors(res);

    console.log(res);
  };

  const OpenFullView = (supervisor) => {
    setSelectedSupervisor(supervisor);

    const modal = new window.bootstrap.Modal(
      document.getElementById("supViewModal"),
    );

    modal.show();
  };

  useEffect(() => {
    FetchSupervisorsFromDB();
  }, []);

 
  const toggleVisibility = () => {
    setContisvisible((prev) => !prev);
  };

  const RemoveSupervisorHandler = async (email, name) => {
    let Choiseresult = await Swal.fire({
      title: "Alert",
      text: `Delete Supervisor ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete",
      customClass: {
        title: "small-title",
      },
    });

    if (Choiseresult.isConfirmed) {
      const req = await callapi(`${ApiRoute}remove-supervisor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("result is ", req.success);

      if (req.success) {
        console.log("Supervisor Deleted Successfully");

        toast.success(req.message);

        FetchSupervisorsFromDB();
      } else {
        console.log("Failed to delete supervisor");

        toast.error(req.message || "Error");
      }
    }
  };

const filteredSupervisors = allSupervisors.filter((s) => {
  return (
    (s.SupervisorName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.SupervisorEmail || "").toLowerCase().includes(search.toLowerCase())
  );
});

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />

      <div className="container sup-container p-3">
        {/* Header */}
        <div className="sup-header">
          <div>
            <h2 className="sup-title">Supervisors</h2>
            <p className="sup-subtitle">
              Showing {filteredSupervisors.length} of {allSupervisors.length}{" "}
              supervisors
            </p>
          </div>

          <div className="sup-count-pill">{allSupervisors.length}</div>
        </div>

      

        {/* Search */}
        <div className="sup-search-wrapper">
          <i className="bi bi-search"></i>

          <input
            type="text"
            className="sup-search"
            placeholder="Search supervisors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Cards */}
        <div className="row g-4 mt-1">
          {filteredSupervisors.length > 0 ? (
            filteredSupervisors.map((data, index) => (
              <div className="col-lg-6" key={index}>
                <motion.div
                  whileHover={{
                    y: -4,
                  }}
                  transition={{ duration: 0.2 }}
                  className="sup-card"
                >
                  <div className="sup-avatar">
                    <img
                      src={`${uploadUrl}${data.SupervisorPhoto}`}
                      alt={data.SupervisorName}
                      onError={(e) => {
                        e.target.src = "/defaultlabouricon.png";
                      }}
                    />
                  </div>

                  <div className="sup-content">
                    <div className="sup-info">
                      <h5>{data.Name}</h5>

                      <p>{data.Email}</p>

                      <span className="sup-status">Supervisor</span>
                    </div>

                    <div className="sup-actions">
                      <button
                        className="sup-btn-view"
                        onClick={() => OpenFullView(data)}
                      >
                        View
                      </button>
                      <button
                        className="sup-btn-remove"
                        onClick={() =>
                          RemoveSupervisorHandler(
                            data.Email,
                            data.SupervisorName,
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="sup-empty">
                <div className="sup-empty-icon">🔍</div>

                <h4>No Supervisor Found</h4>

                <p>Try searching with another name.</p>

                <button className="sup-clear-btn" onClick={() => setSearch("")}>
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className="modal fade"
        id="supViewModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content sup-modal">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Supervisor Details</h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body text-center">
              <img
                src={`${uploadUrl}${selectedSupervisor?.SupervisorPhoto}`}
                alt=""
                className="sup-modal-img"
                onError={(e) => {
                  e.target.src = "/defaultlabouricon.png";
                }}
              />

              <h4 className="mt-3">{selectedSupervisor?.Name}</h4>

              <p className="text-muted">{selectedSupervisor?.Email}</p>

              <div className="sup-modal-details">
                <div className="sup-detail-row">
                  <span>📞 Phone</span>
                  <strong>{selectedSupervisor?.Phone}</strong>
                </div>

                <div className="sup-detail-row">
                  <span>📍 Address</span>
                  <strong>{selectedSupervisor?.Address}</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
