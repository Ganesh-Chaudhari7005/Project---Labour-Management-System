import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Button } from "bootstrap";
import { useContext } from "react";
import LoginContext from "../Context/LoginContext";
export default function EquipmentManagement() {
  let { loggedInUser } = useContext(LoginContext);
  return (
    <>
      <>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="manage-project-tabs-wrapper">
            <div className="manage-project-tabs equip-tabs-st flex-column flex-md-row">
              <NavLink to="." end>
                {({ isActive }) => (
                  <button
                    className={
                      isActive
                        ? "project-tab-btn active-tab"
                        : "project-tab-btn"
                    }
                  >
                    All Equipments
                  </button>
                )}
              </NavLink>
              {loggedInUser?.UserRole === "Admin" && (
                <NavLink to="add-equipment">
                  {({ isActive }) => (
                    <button
                      className={
                        isActive
                          ? "project-tab-btn active-tab"
                          : "project-tab-btn"
                      }
                    >
                      Add Equipments
                    </button>
                  )}
                </NavLink>
              )}
              {loggedInUser?.UserRole === "Admin" && (
                <NavLink to="remove-equipment">
                  {({ isActive }) => (
                    <button
                      className={
                        isActive
                          ? "project-tab-btn active-tab"
                          : "project-tab-btn"
                      }
                    >
                      Remove Equipments
                    </button>
                  )}
                </NavLink>
              )}
              <NavLink to="assign-equipments">
                {({ isActive }) => (
                  <button
                    className={
                      isActive
                        ? "project-tab-btn active-tab"
                        : "project-tab-btn"
                    }
                  >
                    Assign/UnAssign Equipments
                  </button>
                )}
              </NavLink>
            </div>

            <div className="container px-0">
              <Outlet />
            </div>
          </div>
          <br />
        </motion.div>
      </>
    </>
  );
}
