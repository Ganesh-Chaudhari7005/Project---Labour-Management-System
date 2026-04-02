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

  const OpenFullView = (index) => {
    setLabName(AllLabours[index].Name);
    setLabImg(AllLabours[index].profileImgPath);
    setLabType(AllLabours[index].LabType);
    setLabEmail(AllLabours[index].Email);
    setLabPhone(AllLabours[index].Phone);
    setLabAddr(AllLabours[index].Address);
    setContisvisible((prev) => (prev = !prev));
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
        <h4 className="mb-5 d-inline-block">
          All Labours ({AllLabours.length})
        </h4>

        <NavLink to="add-labour">
          <button className="defbtn">+ Add Labour</button>
        </NavLink>
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

        <div className="row g-3">
          {AllLabours.map((data, index) => (
            <div className="col-lg-3 p-0" key={index}>
              <div
                className="card cust-card"
                style={{ width: "15rem", height: "20rem" }}
              >
                <div className="card-img-cont">
                  <img
                    src={`${uploadUrl}${data.profileImgPath}`}
                    className="img-fluid"
                    alt="..."
                    onError={(e) => {
                      e.target.src = "/public/defaultlabouricon.png";
                    }}
                  />
                </div>

                <div className="card-body d-flex flex-column align-items-center">
                  <h5 className="card-title text-capitalize">{data.Name}</h5>
                  <p className="card-text">Worker Type : {data.LabType}</p>
                  <div className="btn-cont d-flex gap-2">
                    <button
                      onClick={() => {
                        OpenFullView(index);
                      }}
                      className="card-btn"
                    >
                      More Info.
                    </button>
                    <button
                      onClick={() => {
                        RemoveLabourHandler(data.Email, data.Name);
                      }}
                      className="px-2 py-0"
                      style={{
                        backgroundColor: "#dc2626",
                        borderRadius: "5px",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
