import React, { useContext, useEffect, useState } from "react";
import LoginContext from "../Context/LoginContext";
import { Link, Navigate, NavLink , useLocation} from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  FaUserCircle,
  FaUsers,
  FaFolderOpen,
  FaHardHat,
  FaCalendarCheck,
  FaTools,
  FaNewspaper,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
export default function Dashboard() {
  let { loggedInUser } = useContext(LoginContext);
  const [activeComp , setActivecomp] = useState('Dashboard');
  const featureIcons ={
    "Profile" : FaUserCircle,
      "Manage Users" : FaUsers,
      "Project Management" : FaFolderOpen,
      "Manage Labours" :FaHardHat,
      "Attendance" : FaCalendarCheck,
      "Manage Equipments":FaTools,
      "CMS" :FaNewspaper
  }
  const location = useLocation(); 
  const permissions = {
    Admin: [
      "Profile",
      "Manage Users",
      "Project Management",
      "Manage Labours",
      "Attendance",
      "Manage Equipments",
      "CMS",
    ],
    Supervisor: ["Profile","Manage-Labours", "Attendance", "Manage Equipments", "CMS"],
    Labour: ["Profile","View Attendance"],
    Client: ["Profile","Work Status","Feedback","Billing"],
  };

  const allowedFeatures = permissions[loggedInUser?.Role] || [];
  return (
    <div className="dash-cont-outer pb-3">
      <div className="container-fluid h-100">
        <div className="h-100">
          <div className="row h-100">
            <div className="col-lg-2 h-100">
              <div className="navfeature">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `${isActive ? "text-black nav-item-active" : "text-white"} adminnavbtn
                    ${isActive ? setActivecomp("Dashboard") : ""}
                  `
                  }
                >
                  {<MdDashboard className="me-2" />}
                  Dashboard
                </NavLink>
                {allowedFeatures.map((feature, index) => {
                  const Icon = featureIcons[feature];
                  return (
                    <NavLink
                      to={feature.toLowerCase().replaceAll(" ", "-")}
                      className={({ isActive }) =>
                        `${isActive ? "text-black nav-item-active" : "text-white "} adminnavbtn 
                         ${isActive ? setActivecomp(feature) : ""}
                      `
                      }
                    >
                      {Icon && <Icon className="me-2" />}
                      {feature}
                    </NavLink>
                  );
                })}
              </div>
            </div>
            <div className="col-lg-10 h-100">
              <div className="dash-login-info p-3 mb-3">
                <p className="m-0 active-comp-admin">{activeComp}</p>

                <div className="loginuser-opt">
                  <p className="loginusername">
                    Welcome {loggedInUser.UserName}
                  </p>
                </div>
              </div>
              <div className="outlet-cont">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
