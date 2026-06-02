import { motion } from "framer-motion";
import {ApiRoute} from "./ApiConfig.js";
import { useEffect, useState } from "react";
export default function AdminDashboard() {

    const[TotalProjectsCount , setTotalProjectCount] = useState(0);
    const [CompletedProjectCount, SetCompletedProjectCount] = useState(0);
    const [PendingProjectCount, SetPendingProjectCount] = useState(0);
  const stats = [
    { title: "Projects", count: 24, color: "#4f46e5" },
    { title: "Users", count: 120, color: "#16a34a" },
    { title: "Labours", count: 58, color: "#f59e0b" },
    { title: "Equipment", count: 33, color: "#ef4444" },
  ];

  const getProjectCounts = async()=>{   
    let req =  await fetch(`${ApiRoute}get-project-count`);
    let res = await req.json();
    console.log(res);
    
    setTotalProjectCount(res.TotalProjectCount);
    SetCompletedProjectCount(res.CompletedCount);
    SetPendingProjectCount(res.PendingCount);

  }

  useEffect(()=>{
        getProjectCounts();
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
            style={{ borderTop: `4px solid #4f46e5` }}
          >
            <div className="dash-title">Total Projects</div>
            <div className="dash-count">{TotalProjectsCount}</div>
            <div className="dash-sub">
              Total Completed : {CompletedProjectCount}
            </div>
            <div className="dash-sub">
              Total Pending : {PendingProjectCount}
            </div>
          </motion.div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="dash-card" 
            style={{ borderTop: `4px solid #16a34a` }}
          >
            <div className="dash-title">Total Projects</div>
            <div className="dash-count">{TotalProjectsCount}</div>
            <div className="dash-sub">
              Total Completed : {CompletedProjectCount}
            </div>
            <div className="dash-sub">
              Total Pending : {PendingProjectCount}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
