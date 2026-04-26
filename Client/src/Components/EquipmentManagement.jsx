  import React from 'react'
  import { Outlet } from 'react-router-dom'
  import { motion } from "framer-motion";
  import { NavLink } from 'react-router-dom';
  import { Button } from 'bootstrap';
  export default function EquipmentManagement() {
    return (
      <>
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="d-flex gap-3">
              <NavLink to="." end>
                {({ isActive }) => (
                  <button
                    className={`equip-btn
                      ${isActive ? "admin-nav-btn" : "text-white"}`}
                  >
                    All Equipments
                  </button>
                )}
              </NavLink>
              <NavLink to="add-equipment">
                {({ isActive }) => (
                  <button
                    className={`equip-btn
                      ${isActive ? "admin-nav-btn" : "text-white"}`}
                  >
                    Add Equipments
                  </button>
                )}
              </NavLink>
              <NavLink to="remove-equipment">
                {({ isActive }) => (
                  <button
                    className={`equip-btn
                      ${isActive ? "admin-nav-btn" : "text-white"}`}
                  >
                    Remove Equipments
                  </button>
                )}
              </NavLink>
              <NavLink to="assign-equipments">
                {({ isActive }) => (
                  <button
                    className={`equip-btn
                      ${isActive ? "admin-nav-btn" : "text-white"}`}
                  >
                    Assign/UnAssign Equipments
                  </button>
                )}
              </NavLink>
            </div>

            <div className="container px-0">
              <Outlet />
            </div>
            <br />
          </motion.div>
        </>
      </>
    );
  }
