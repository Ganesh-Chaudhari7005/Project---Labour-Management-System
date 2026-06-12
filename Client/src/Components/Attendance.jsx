import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Attendance() {
   const tabs = [
     {
       name: " Record Attendance",
       path: ".",
       end: true,
       icon: "ri-dashboard-line",
     },
     {
       name: "Attendance Report",
       path: "attendance-report",
       icon: "ri-tools-line",
     },
   ];
  return (
    <div>
      <div className="manage-project-tabs-wrapper">
        <div className="manage-project-tabs">
          {tabs.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.path}
              end={tab.end}
              className="navlink-reset att-tabs-res"
            >
              {({ isActive }) => (
                <button
                  className={
                    isActive ? "project-tab-btn active-tab" : "project-tab-btn"
                  }
                >
                  <i className={tab.icon}></i>
                  {tab.name}
                </button>
              )}
            </NavLink>
          ))}
        </div>
      </div>
      {/* <NavLink to="." end>
        {({ isActive }) => (
          <button
            className={`equip-btn mx-2
                            ${isActive ? "admin-nav-btn" : "text-white"}`}
          >
            Record Attendance
          </button>
        )}
      </NavLink>

      <NavLink to="attendance-report" end>
        {({ isActive }) => (
          <button
            className={`equip-btn
                            ${isActive ? "admin-nav-btn" : "text-white"}`}
          >
            Attendance Report
          </button>
        )}
      </NavLink> */}

      <Outlet />
    </div>
  );
}
