import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {motion} from "framer-motion";
export default function AttendanceContSup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <NavLink to="." end>
          {({ isActive }) => (
            <button
              className={`equip-btn mx-2
                            ${isActive ? "admin-nav-btn" : "text-white"}`}
            >
              Record Attendance
            </button>
          )}
        </NavLink>

        <NavLink to="attendance-report-sup" end>
          {({ isActive }) => (
            <button
              className={`equip-btn
                            ${isActive ? "admin-nav-btn" : "text-white"}`}
            >
              Attendance Report
            </button>
          )}
        </NavLink>

        <Outlet />
      </div>
    </motion.div>
  );
}
