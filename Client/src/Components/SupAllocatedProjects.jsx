import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ApiRoute } from "./ApiConfig.js";
import { NavLink } from "react-router-dom";

export default function SupAllocatedProjects() {

const [projects, setProjects] = useState([]);
  const getAocatedPrjDet= async()=>{
    const SupId = sessionStorage.getItem("SupId");

    let req = await fetch(`${ApiRoute}getALcPrjDetSup/${SupId}`);

    let res = await req.json();

    console.log(res);

    setProjects(res);
    
  }

  useEffect(()=>{
    getAocatedPrjDet();
  },[]);

    const getStatusClass = (status) => {
      switch (status?.toLowerCase()) {
        case "completed":
          return "pjx-chip pjx-chip--done";
        case "in progress":
          return "pjx-chip pjx-chip--progress";
        case "pending":
          return "pjx-chip pjx-chip--pending";
        default:
          return "pjx-chip";
      }
    };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="project-top-section">
        <div className="project-header-card">
          <div className="project-header-left">
            <div className="project-badge">
              <i className="ri-building-line"></i>
              Sites Allocated to You
            </div>
          </div>
          <div className="project-bg-circle one"></div>
          <div className="project-bg-circle two"></div>
        </div>
      </div>
      <div className="pjx-grid">
        {projects.map((data) => (
          <div className="pjx-card" key={data.ProjectID}>
            <div className="pjx-card-top">
              <h5 className="pjx-project-name">{data.ProjectName}</h5>

              <span className={getStatusClass(data.Status)}>
                Status : {data.Status}
              </span>
            </div>

            <div className="pjx-meta">
              Assign Date:{" "}
              {new Date(data.Assign_Date).toLocaleDateString("en-GB")}
            </div>
            <NavLink to={`/dashboard/sup-alc-prj/${data.ProjectID}`}>
              <button className="pjx-btn-manage">View Project →</button>
            </NavLink>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
