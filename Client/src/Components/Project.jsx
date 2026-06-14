import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";
import { ApiRoute } from "./ApiConfig.js";
import { motion } from "framer-motion";
export default function Project() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  const fetchProjects = async () => {
    setLoading(true);
    let res = await fetch(`${ApiRoute}fetch-projects`);
    let data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.ProjectName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.Status?.toLowerCase() === statusFilter,
      );
    }

    filtered.sort((a, b) => {
      if (sortOrder === "latest") return b.ProjectID - a.ProjectID;
      return a.ProjectID - b.ProjectID;
    });

    return filtered;
  }, [projects, search, statusFilter, sortOrder]);

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
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ToastContainer />

        <div className="pjx-wrap">
          {/* HEADER */}
          <div className="pjx-header">
            <h3 className="pjx-title">All Sites</h3>

            <NavLink to="create-project">
              <button className="pjx-btn-create">+ New Project</button>
            </NavLink>
          </div>

          {/* FILTERS */}
          <div className="pjx-filters">
            <input
              className="pjx-search"
              placeholder="Search sites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="pjx-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="pjx-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* GRID */}
          <div className="pjx-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div className="pjx-skeleton-card" key={i}>
                    <div className="pjx-skel-line pjx-skel-title"></div>
                    <div className="pjx-skel-line pjx-skel-chip"></div>
                    <div className="pjx-skel-line pjx-skel-text"></div>
                    <div className="pjx-skel-btn"></div>
                  </div>
                ))
              : filteredProjects.map((data) => (
                  <div className="pjx-card" key={data.ProjectID}>
                    <div className="pjx-card-top">
                      <h5 className="pjx-project-name">{data.ProjectName}</h5>

                      <span className={getStatusClass(data.Status)}>
                        {data.Status}
                      </span>
                    </div>

                    <div className="pjx-meta">
                      Project ID: #{data.ProjectID}
                    </div>

                    <NavLink to={`manage-project/${data.ProjectID}`}>
                      <button className="pjx-btn-manage">
                        Manage Site →
                      </button>
                    </NavLink>
                  </div>
                ))}
          </div>
           {filteredProjects.length === 0 && (
          <div className="pjx-empty">
            <div className="pjx-empty-icon">🔍</div>
            <h4>No matching projects</h4>
            <p>Try changing filters or search keyword</p>
          </div>
        )}
        </div>
      </motion.div>
    </>
  );
}
