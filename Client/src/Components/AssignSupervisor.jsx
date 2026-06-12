import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { ApiRoute } from "./ApiConfig.js";

export default function AssignSupervisor() {
  const [supervisors, setSupervisors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [supervisorId, setSupervisorId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [search, setSearch] = useState("");

const fetchAll = async () => {
  try {
    const supervisorsRes = await fetch(`${ApiRoute}supervisors`);
    const projectsRes = await fetch(`${ApiRoute}projects`);
    const assignmentsRes = await fetch(`${ApiRoute}supervisor-assignments`);

    console.log("responce is",supervisorsRes);
    
    const supervisorsData = await supervisorsRes.json();
    const projectsData = await projectsRes.json();
    const assignmentsData = await assignmentsRes.json();

    console.log("Supervisors:", supervisorsData);
    console.log("Projects:", projectsData);
    console.log("Assignments:", assignmentsData);

    console.log("datacall",supervisorsRes);
    
    setSupervisors(supervisorsData);
    setProjects(projectsData);
    setAssignments(assignmentsData);
  } catch (err) {
    console.error("error is", err);
    toast.error("Failed to load data");
  }
};

  useEffect(() => {
    fetchAll();
  }, []);

  const selectedSupervisor = supervisors.find((s) => s.ID === supervisorId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supervisorId || !projectId) {
      return toast.warning("Select both fields");
    }

   

    const res = await fetch(`${ApiRoute}assign-supervisor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        supervisorId,
        projectId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return toast.error(data.message);
    }

    toast.success("Assigned successfully");

    setSupervisorId("");
    setProjectId("");

    fetchAll();
  };

 const handleRemove = async (assignId, supervisorId) => {
   const res = await fetch(`${ApiRoute}assign-supervisor`, {
     method: "DELETE",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       assignId,
       supervisorId,
     }),
   });

   const data = await res.json();

   if (!res.ok) {
     return toast.error(data.message);
   }

   toast.success("UnAssigned Successfully");
   fetchAll();
 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="assign-page-enhanced"
    >
      <ToastContainer />

      <div className="assign-header-enhanced">
        <div>
          <h2>Supervisor Assignment</h2>
          <p>Manage and assign supervisors to Sites</p>
        </div>
      </div>

      <div className="assign-stats-enhanced">
        <div className="stat-card">
          <h3>{supervisors.length}</h3>
          <span>Total Supervisors</span>
        </div>

        <div className="stat-card green">
          <h3>{supervisors.filter((s) => s.IsAvailable).length}</h3>
          <span>Available</span>
        </div>

        <div className="stat-card blue">
          <h3>{assignments.length}</h3>
          <span>Assignments</span>
        </div>
      </div>

      <form className="assign-form-enhanced" onSubmit={handleSubmit}>
        <div className="field assign-feild-res">
          <label>Supervisor</label>

          <select
            value={supervisorId}
            onChange={(e) => setSupervisorId(e.target.value)}
          >
            <option value="">Select Supervisor</option>

            {supervisors.map((s) => (
              <option key={s.ID} value={s.ID}>
                {s.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="field assign-feild-res">
          <label>Project</label>

          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Select Project</option>

            {projects.map((p) => (
              <option key={p.ProjectID} value={p.ProjectID}>
                {p.ProjectName}
              </option>
            ))}
          </select>
        </div>

        <button className="assign-btn-enhanced">Assign</button>
      </form>

      <div className="assign-toolbar-enhanced">
        <input
          placeholder="Search supervisor or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="assign-table-wrapper">
        <table className="assign-table-enhanced">
          <thead>
            <tr>
              <th>Supervisor</th>
              <th>Project</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {assignments
              .filter(
                (a) =>
                  a.Name.toLowerCase().includes(search.toLowerCase()) ||
                  a.ProjectName.toLowerCase().includes(search.toLowerCase()),
              )
              .map((a) => (
                <tr key={a.AssignID}>
                  <td>{a.Name}</td>
                  <td>{a.ProjectName}</td>

                  <td>{new Date(a.Assign_Date).toLocaleDateString()}</td>

                  <td>
                    <span className="status-badge-active">Assigned</span>
                  </td>

                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(a.AssignID, a.SupervisorID)}
                    >
                      UnAssign
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}


