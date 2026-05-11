import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { ApiRoute } from "./ApiConfig.js";

export default function AssignLabours() {
  const [labours, setLabours] = useState([]);
  const [projects, setProjects] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [labourId, setLabourId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [search, setSearch] = useState("");

  const fetchAll = async () => {
    try {
      const [l, p, a] = await Promise.all([
        fetch(`${ApiRoute}labours`).then((r) => r.json()),
        fetch(`${ApiRoute}projects`).then((r) => r.json()),
        fetch(`${ApiRoute}assignments`).then((r) => r.json()),
      ]);

      setLabours(l);
      setProjects(p);
      setAssignments(a);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const selectedLabour = labours.find((l) => l.ID === labourId);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!labourId || !projectId) {
    return toast.warning("Select both fields");
  }

  if (selectedLabour?.IsAvailable === 0) {
    return toast.error("Labour not available");
  }

  // ✅ NEW CHECK
  const alreadyAssigned = assignments.some(
    (a) => a.LabourID === labourId && a.ProjectID === projectId,
  );

  if (alreadyAssigned) {
    return toast.warning("This labour is already assigned to this project");
  }

  const res = await fetch(`${ApiRoute}assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ labourId, projectId }),
  });

  const data = await res.json();

  if (!res.ok) return toast.error(data.message);

  toast.success("Assigned successfully");
  setLabourId("");
  setProjectId("");
  fetchAll();
};

  const handleRemove = async (id) => {
    await fetch(`${ApiRoute}assign/${id}`, {
      method: "DELETE",
    });

    toast.success("Removed");
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

      {/* Header */}
      <div className="assign-header-enhanced">
        <div>
          <h2>Labour Assignment</h2>
          <p>Manage and assign labours to projects</p>
        </div>
      </div>

      {/* Stats */}
      <div className="assign-stats-enhanced">
        <div className="stat-card">
          <h3>{labours.length}</h3>
          <span>Total Labours</span>
        </div>

        <div className="stat-card green">
          <h3>{labours.filter((l) => l.IsAvailable).length}</h3>
          <span>Available</span>
        </div>

        <div className="stat-card blue">
          <h3>{assignments.length}</h3>
          <span>Assignments</span>
        </div>
      </div>

      {/* Form */}
      <form className="assign-form-enhanced" onSubmit={handleSubmit}>
        <div className="field">
          <label>Labour</label>
          <select
            value={labourId}
            onChange={(e) => setLabourId(e.target.value)}
          >
            <option value="">Select Labour</option>
            {labours.map((l) => (
              <option key={l.ID} value={l.ID}>
                {l.Name} ({l.IsAvailable ? "Available" : "Busy"})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
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

      {/* Toolbar */}
      <div className="assign-toolbar-enhanced">
        <input
          placeholder="Search labour or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="assign-table-wrapper">
        <table className="assign-table-enhanced">
          <thead>
            <tr>
              <th>Labour</th>
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
                <tr key={a.AssignmentID}>
                  <td>{a.Name}</td>
                  <td>{a.ProjectName}</td>
                  <td>{new Date(a.AssignDate).toLocaleDateString()}</td>

                  <td>
                    <span className="status-badge-active">Assigned</span>
                  </td>

                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(a.AssignmentID)}
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
