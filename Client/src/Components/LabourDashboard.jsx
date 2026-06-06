import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ApiRoute } from "./ApiConfig";

export default function LabourDashboard() {
  const labourID = sessionStorage.getItem("LabourID");

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);


const fetchDashboard = async () => {
  console.log("called");
  
  try {
    const res = await fetch(`${ApiRoute}labour/dashboard/${labourID}`);

    const data = await res.json();

    console.log("Dashboard API:", data);

    setDashboard(data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchDashboard();
  }, []);
  if (loading)
    return <div className="text-center py-5">Loading Dashboard...</div>;

  const labour = dashboard?.labour;
  const project = dashboard?.project;
  const summary = dashboard?.summary || {};
  const attendancePercentage = dashboard?.attendancePercentage || 0;
  const recentWork = dashboard?.recentWork || [];

const cards = [
  {
    title: "Days Worked",
    value: summary.PresentDays || 0,
    sub: "This Month",
  },
  {
    title: "Absent Days",
    value: summary.AbsentDays || 0,
    sub: "This Month",
  },
  {
    title: "Total Days",
    value: summary.TotalDays || 0,
    sub: "This Month",
  },
  {
    title: "Wages Earned",
    value: `₹${summary.TotalWages || 0}`,
    sub: "This Month",
  },
  {
    title: "Money Taken",
    value: `₹${summary.TotalAdvance || 0}`,
    sub: "This Month",
  },
  {
    title: "Attendance %",
    value: `${attendancePercentage}%`,
    sub: "This Month",
  },
];


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-4"
    >
      {/* Welcome Section */}

      <div className="welcome-card mb-4">
        <div className="d-flex align-items-center gap-3">
          <img
            src={labour?.profileImgPath || "/default-user.png"}
            className="profile-img"
            alt=""
          />

          <div>
            <h4 className="mb-1">Welcome, {labour?.Name}</h4>
            <p className="mb-0 text-muted">{labour?.LabType}</p>
          </div>
        </div>
      </div>

      {/* Stats */}

      <div className="row g-4 mb-4">
        {cards.map((card, index) => (
          <div className="col-12 col-md-6 col-xl-4" key={index}>
            <motion.div whileHover={{ y: -4 }} className="dash-card">
              <div className="dash-title">{card.title}</div>

              <div className="dash-count">{card.value}</div>

              <div className="dash-sub">{card.sub}</div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Current Project */}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="mb-3">Current Working Site</h5>

          {project ? (
            <>
              <h6>{project.ProjectName}</h6>

              <p className="text-muted mb-2">{project.Address}</p>
            </>
          ) : (
            <p>No project assigned</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
