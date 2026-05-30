import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AttendanceContSup() {
  return (
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
  );
}
