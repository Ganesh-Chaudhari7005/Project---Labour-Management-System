import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, useScroll } from 'framer-motion'
import { NavLink } from 'react-router-dom';
export default function ClientBilling() {
  const tabs = [
    {
      name: "Pending Bills",
      path: ".",
      end: true,
      icon: "ri-dashboard-line",
    },
    {
      name: "Paid Bills",
      path: "client-paid-bills",
      icon: "ri-tools-line",
    },
    
  ];

  const [ActiveTab, setActiveTab] = useState("Pending Bills")

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
        <div className="manage-project-tabs">
          {tabs.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.path}
              end={tab.end}
              className="navlink-reset"
            >
              {({ isActive }) => (
                <button
                  className={
                    isActive ? "project-tab-btn active-tab" : "project-tab-btn"
                  }
                  onClick={() => setActiveTab(tab.name)}
                >
                  <i className={tab.icon}></i>
                  {tab.name}
                </button>
              )}
            </NavLink>
          ))}
      </div>
      <div className="project-top-section">
        <div className="project-header-card">
          <div className="project-header-left">
            <div className="project-badge">
              <i className="ri-building-line"></i>
              {ActiveTab}
            </div>

            {/* <h1>Manage Profile</h1> */}
          </div>

          {/* Decorative Elements */}
          <div className="project-bg-circle one"></div>
          <div className="project-bg-circle two"></div>
        </div>
      </div>
      <Outlet />
    </motion.div>
  );
}
