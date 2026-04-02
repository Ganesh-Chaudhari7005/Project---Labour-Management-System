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
          <NavLink
            to="."
            end
            className={({ isActive }) =>
              `${isActive ? "text-black" : "text-white"}`
            }
          >
            <button>Project Details</button>
          </NavLink>
          <NavLink
            to="assign-labours"
            end
            className={({ isActive }) =>
              `${isActive ? "text-black" : "text-white"}`
            }
          >
            <button>Manage Labours</button>
          </NavLink>
        </div><br/>
        <Outlet />
      </div>
    </motion.div>
  );
}
