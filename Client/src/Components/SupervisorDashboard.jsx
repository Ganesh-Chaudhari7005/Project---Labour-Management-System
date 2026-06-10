import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {ApiRoute} from "./ApiConfig.js";
export default function SupervisorDashboard() {
  const[totalSites, setTotalSites] = useState(0);
  const[totalLabours, setTotalLabours] = useState(0);
  const [projectProgress, setProgress] = useState([]);
  const [past30presentDays, setPast30Presentdays] = useState(0);

  const ID = sessionStorage.getItem("SupId");


  const getTotalAssignedProjects = async()=>{
    let req = await fetch(`${ApiRoute}get-sup-asignedprj-count/${ID}`);
        let res = await req.json();
        console.log(res);
        setTotalSites(res.TotalSites);
  }

  const getToatalLabours = async()=>{
     let req = await fetch(`${ApiRoute}get-totalLabour-count/${ID}`);
     let res = await req.json();
     console.log(res);
     setTotalLabours(res.TotalLabours);
  }

  const getProgress = async()=>{
    const req = await fetch(`${ApiRoute}get-sup-project-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID }),
    });

    const res = await req.json();
    console.log(res);
    
    setProgress(res);
  };
  
  useEffect(()=>{
    getTotalAssignedProjects();
    getToatalLabours();
    getProgress();
  },[])
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-4"
    >
      <div className="row g-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="dash-card"
            style={{ borderTop: `4px solid` }}
          >
            <div className="dash-title">Total Sites</div>
            <div className="dash-count">{totalSites || "-"}</div>
            <div className="dash-sub">Total Sites Assigned to you </div>
          </motion.div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="dash-card"
            style={{ borderTop: `4px solid #16a34a` }}
          >
            <div className="dash-title">Total Labours</div>
            <div className="dash-count">{totalLabours || "-"}</div>
            <div className="dash-sub">Total Labours assigned</div>
          </motion.div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="dash-card"
            style={{ borderTop: `4px solid #f59e0b` }}
          >
            <div className="dash-title">Total Days Present</div>
            <div className="dash-count">{totalLabours || "-"}</div>
            <div className="dash-sub">Total Days Present Past 30 days</div>
          </motion.div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="dash-card"
            style={{ borderTop: `4px solid #ef4444` }}
          >
            <div className="dash-title">Total Days Absent</div>
            <div className="dash-count">{totalLabours || "-"}</div>
            <div className="dash-sub">Total Days Absent Past 30 days</div>
          </motion.div>
        </div>
      </div>
      <div className="row py-3">
        <div className="col-lg-7">
          <div className="row g-3">
            {projectProgress.map((p) => (
              <div className="col-md-12">
                <motion.div
                  className="dash-card"
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: "#c5fccf",
                  }}
                >
                  <div className="dash-title">Site : {p.ProjectName}</div>

                  <div className="d-flex justify-content-between mt-2">
                    <small>Work Progress</small>
                    <small>{p.OverallProgress}%</small>
                  </div>

                  <div className="progress" style={{height : "5px" , backgroundColor : "#fff"}}>
                    <div
                      className="progress-bar"
                      style={{ width: `${p.OverallProgress}%`, height: "5px"}}
                    />
                  </div>

                  <div className="dash-sub mt-3">
                    {p.OverallProgress === 100
                      ? "🎉 Completed"
                      : "🏗 In Progress"}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
