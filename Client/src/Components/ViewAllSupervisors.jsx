import React, { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig.js";
import { uploadUrl } from "../uploadConfig";
import { motion } from "framer-motion";
import { useApi } from "./ApiCaller.js";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import ShowLabourDetails from "./ShowLabourDetails.jsx";

export default function ViewAllSupervisors() {
  const callapi = useApi();

  const [allSupervisors, setAllSupervisors] = useState([]);

  const [currentSupName, setSupName] = useState("");
  const [currentSupEmail, setSupEmail] = useState("");
  const [currentSupPhone, setSupPhone] = useState("");
  const [currentSupImg, setSupImg] = useState("");
  const [currentSupAddr, setSupAddr] = useState("");

  const [search, setSearch] = useState("");

  const [isConVisible, setContisvisible] = useState(false);

  const FetchSupervisorsFromDB = async () => {
    let reqSup = await fetch(`${ApiRoute}fetch-supervisors`);

    console.log(reqSup.status);

    let res = await reqSup.json();

    setAllSupervisors(res);

    console.log(res);
  };

  useEffect(() => {
    FetchSupervisorsFromDB();
  }, []);

  const OpenFullView = (supervisor) => {
    setSupName(supervisor.Name);
    setSupImg(supervisor.profileImgPath);
    setSupEmail(supervisor.Email);
    setSupPhone(supervisor.Phone);
    setSupAddr(supervisor.Address);

    setContisvisible((prev) => !prev);
  };

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

      <div className="container remuser-cont p-3">
        <div className="labour-title-bar">
          <div>
            <h3>All Supervisors</h3>

            <p>
              Showing {filteredSupervisors.length} of {allSupervisors.length}{" "}
              supervisors
            </p>
          </div>

          <div className="labour-pill">Total: {allSupervisors.length}</div>
        </div>

        <ShowLabourDetails
          onClose={toggleVisibility}
          isVisible={isConVisible}
          address={currentSupAddr}
          phone={currentSupPhone}
          email={currentSupEmail}
          imgpath={currentSupImg}
          Name={currentSupName || ""}
        />

        <div className="labour-toolbar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="row g-3">
          {filteredSupervisors.length > 0 ? (
            filteredSupervisors.map((data, index) => (
              <div className="col-12" key={index}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="labour-row-card"
                >
                  {/* IMAGE */}
                  <div className="labour-row-img">
                    <img
                      src={`${uploadUrl}${data.SupervisorPhoto}`}
                      alt={data.SupervisorName}
                      onError={(e) => {
                        e.target.src = "/defaultlabouricon.png";
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div className="labour-row-info">
                    <h5>{data.Name}</h5>

                    <p>{data.Email}</p>
                  </div>

                  {/* ACTIONS */}
                  <div className="labour-row-actions">
                    <button
                      className="row-btn view"
                      onClick={() => OpenFullView(data)}
                    >
                      View
                    </button>

                    <button
                      className="row-btn delete"
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
                </motion.div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="no-data-container">
                <div className="no-data-icon">🔍</div>

                <h5>No supervisor found</h5>

                <p>Try changing search</p>

                <button
                  className="clear-btn"
                  onClick={() => {
                    setSearch("");
                  }}
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
