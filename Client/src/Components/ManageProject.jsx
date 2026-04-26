import React, { useEffect , useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function ManageProject() {
  
  const { id } = useParams();
  
 
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
      <div className="container">
        <div className="d-flex gap-2">
          <div className="manage-project-tabs">
            <NavLink to="." end>
              {({ isActive }) => (
                <button className={isActive ? "admin-nav-btn" : "rounded"}>
                  Project Details
                </button>
              )}
            </NavLink>

            <NavLink to="project-status">
              {({ isActive }) => (
                <button className={isActive ? "admin-nav-btn" : "rounded"}>
                  Project Status
                </button>
              )}
            </NavLink>

            <NavLink to="assign-labours">
              {({ isActive }) => (
                <button className={isActive ? "admin-nav-btn" : "rounded"}>
                  Manage Labours
                </button>
              )}
            </NavLink>
            <NavLink to="generate-bill">
              {({ isActive }) => (
                <button className={isActive ? "admin-nav-btn" : "rounded"}>
                  Generate Bill
                </button>
              )}
            </NavLink>
            <NavLink to="view-past-bills">
              {({ isActive }) => (
                <button className={isActive ? "admin-nav-btn" : "rounded"}>
                  View Bills
                </button>
              )}
            </NavLink>
          </div>
        </div>
        <br />
        <Outlet />
      </div>
    </motion.div>
  );
}
