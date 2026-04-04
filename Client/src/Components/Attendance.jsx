import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Attendance() {
  return (
    <div>
      <NavLink to="." end>
        {({ isActive }) => (
          <button
            className={`equip-btn
                            ${isActive ? "equip-btn-active" : "text-white"}`}
          >
            Record Attendance
          </button>
        )}
      </NavLink>

      <Outlet />
    </div>
  );
}
