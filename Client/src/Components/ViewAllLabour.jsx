import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { ApiRoute } from "./ApiConfig.js";
import { uploadUrl } from "../uploadConfig";
import ShowLabourDetails from "./ShowLabourDetails.jsx";
import { motion } from "framer-motion";
import { useApi } from "./ApiCaller.js";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
ShowLabourDetails;
export default function ViewAllLabour() {
  const callapi = useApi();
  const [AllLabours, setAllLabours] = useState([]);
  const [currrentLabName, setLabName] = useState("");
  const [currrentLabEmail, setLabEmail] = useState("");
  const [currrentLabPhone, setLabPhone] = useState("");
  const [currrentLabImg, setLabImg] = useState("");
  const [currrentLabDOB, setLabDOB] = useState("");
  const [currrentLabAddr, setLabAddr] = useState("");
  const [currrentLabType, setLabType] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isConVisible, setContisvisible] = useState(false);
  const FetchLaboursFromDB = async () => {
    let reqLab = await fetch(`${ApiRoute}fetch-labours`);
    console.log(reqLab.status);

    let res = await reqLab.json();
    setAllLabours(res);
    console.log(reqLab);
    console.log(res);
    console.log(AllLabours);
  };
  useEffect(() => {
    FetchLaboursFromDB();
  }, []);

  const OpenFullView = (labour) => {
    setLabName(labour.Name);
    setLabImg(labour.profileImgPath);
    setLabType(labour.LabType);
    setLabEmail(labour.Email);
    setLabPhone(labour.Phone);
    setLabAddr(labour.Address);
    setContisvisible((prev) => !prev);
  };

  const toggleVisibility = () => {
    setContisvisible((prev) => (prev = !prev));
  };

  const RemoveLabourHandler = async (email, name) => {
    let Choiseresult = await Swal.fire({
      title: "Alert",
      text: `Delete Labour ${name}`,
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
      const req = await callapi(`${ApiRoute}remove-labour`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("result is ", req.success);

      if (req.success) {
        console.log("Labour Deleted Successfully");
        toast.success(req.message);
        FetchLaboursFromDB();
      } else {
        console.log("Failed to delete labour");
        toast.error(req.message || "Error");
      }
    }
  };

 const filteredLabours = AllLabours.filter((l) => {
   const matchesSearch =
     l.Name.toLowerCase().includes(search.toLowerCase()) ||
     l.Email.toLowerCase().includes(search.toLowerCase()) ||
     l.LabType.toLowerCase().includes(search.toLowerCase());

   const matchesType =
     typeFilter === "all" || l.LabType.toLowerCase() === typeFilter;

   return matchesSearch && matchesType;
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
            <h3>All Labours</h3>
            <p>
              Showing {filteredLabours.length} of {AllLabours.length} workers
            </p>
          </div>

          <div className="labour-pill">Total: {AllLabours.length}</div>
        </div>

        <ShowLabourDetails
          onClose={toggleVisibility}
          isVisible={isConVisible}
          address={currrentLabAddr}
          phone={currrentLabPhone}
          email={currrentLabEmail}
          type={currrentLabType}
          imgpath={currrentLabImg}
          Name={currrentLabName || ""}
        />
        <div className="labour-toolbar">
          <input
            type="text"
            placeholder="Search by name, email, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="misteri">Misteri</option>
            <option value="helper">Helper</option>
          </select>
        </div>
        <div className="row g-3">
          {filteredLabours.length > 0 ? (
            filteredLabours.map((data, index) => (
              <div className="col-12" key={index}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="labour-row-card"
                >
                  {/* IMAGE */}
                  <div className="labour-row-img">
                    <img
                      src={`${uploadUrl}${data.profileImgPath}`}
                      alt={data.Name}
                      onError={(e) => {
                        e.target.src = "/defaultlabouricon.png";
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div className="labour-row-info">
                    <h5>{data.Name}</h5>
                    <p>{data.Email}</p>
                    <span className="labour-type-tag">{data.LabType}</span>
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
                      onClick={() => RemoveLabourHandler(data.Email, data.Name)}
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
                <h5>No labour found</h5>
                <p>Try changing search or filter</p>

                <button
                  className="clear-btn"
                  onClick={() => {
                    setSearch("");
                    setTypeFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
