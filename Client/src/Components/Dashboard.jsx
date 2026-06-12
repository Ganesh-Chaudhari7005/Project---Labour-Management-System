import React, { useContext, useEffect, useState } from "react";
import LoginContext from "../Context/LoginContext";
import { Link, Navigate, NavLink , useLocation} from "react-router-dom";
import { Outlet } from "react-router-dom";
import UserAllDetails from "./DemoUser";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import {
  FaUserCircle,
  FaUsers,
  FaFolderOpen,
  FaHardHat,
  FaCalendarCheck,
  FaTools,
  FaNewspaper,
  FaMoneyBillWave,
  FaUserTie,
  FaReceipt,
  FaQuestionCircle,
  FaCommentDots,
  FaClipboardList,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { warning } from "framer-motion";
export default function Dashboard() {
  let { loggedInUser } = useContext(LoginContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [activeComp , setActivecomp] = useState('Dashboard');
  const featureIcons = {
    Profile: FaUserCircle,
    "Manage Users": FaUsers,
    "Project Management": FaFolderOpen,
    "Manage Labours": FaHardHat,
    Attendance: FaCalendarCheck,
    "Manage Equipments": FaTools,
    CMS: FaNewspaper,
    "Manage Wages": FaMoneyBillWave,
    "Manage Supervisors": FaUserTie,
    "Your Projects": FaFolderOpen,
    Billing: FaReceipt,
    "Report Issues": FaQuestionCircle,
    Feedback: FaCommentDots,
    "Labour Attendance": FaCalendarCheck,
    "Sites Allocated": FaClipboardList,
    "Report Site Issues": FaQuestionCircle,
  };
  const location = useLocation(); 
  const permissions = {
    Admin: [
      "Profile",
      "Manage Users",
      "Project Management",
      "Manage Supervisors",
      "Manage Labours",
      "Manage Wages",
      "Attendance",
      "Manage Equipments",
      "CMS",
    ],
    supervisor: [
      "Profile",
      "Manage Labours",
      "Sites Allocated",
      "Labour Attendance",
      "Manage Equipments",
      "CMS",
      "Report Site Issues"
    ],
    labour: ["Profile", "Attendance Report","Report Issue"],
    Client: ["Profile", "Your Projects", "Billing", "Report Issues","Feedback"],
  };

  const HandleLogOut =()=>{
    Swal.fire({
      title: "Are You Sure",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, logout",
      customClass: {
        title: "small-title",
        icon: "swal-icon-small",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("token");
        navigate("/admin");
      }
    });
  }
  const allowedFeatures = permissions[loggedInUser?.UserRole] || [];
  return (
    <div className="dash-cont-outer pb-3">
      <div className="container-fluid h-100">
        <div className="h-100">
          <div className="row h-100">
            <div
              className={`col-lg-2 h-100 sidebar-sys-nav ${menuOpen ? "open" : ""}`}
            >
              <div className="navfeature">
                <div className="linewhite">
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    end
                    className={({ isActive }) =>
                      `${isActive ? "text-black nav-item-active" : "text-white"} adminnavbtn dashboardbtn
                    ${isActive ? setActivecomp("Dashboard") : ""}
                  `
                    }
                  >
                    {<MdDashboard className="me-2" />}
                    Dashboard
                  </NavLink>
                </div>
                {allowedFeatures.map((feature, index) => {
                  const Icon = featureIcons[feature];
                  return (
                    <NavLink
                      onClick={() => setMenuOpen(false)}
                      // to={feature.toLowerCase().replaceAll(" ", "-")}
                      to={
                        feature.toLowerCase() === "attendance report"
                          ? "lab-attendance-report"
                          : feature.toLowerCase().replaceAll(" ", "-")
                      }
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
                <div className="log-sec-res-wrapper">
                  <div className="log-sec-res-card">
                    <div className="log-sec-res-avatar">
                      {loggedInUser?.UserName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="log-sec-res-info">
                      <p className="log-sec-res-name">
                        {loggedInUser?.UserName || "Loading..."}
                      </p>
                      <span className="log-sec-res-role">Administrator</span>
                    </div>

                    <button
                      className="log-sec-res-logout-btn"
                      onClick={HandleLogOut}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-10 h-100">
              <div className="dash-login-info p-3 mb-3">
                <button
                  className="d-lg-none nav-toggle-sys"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  ☰
                </button>
                <p className="m-0  active-comp-admin">{activeComp}</p>

                <div className="loginuser-opt d-flex d-none d-md-flex">
                  <p className="loginusername">
                    {loggedInUser?.UserName || "Loading"}
                  </p>
                  <button
                    className="logoutbtn"
                    onClick={() => {
                      HandleLogOut();
                    }}
                  >
                    LogOut
                  </button>
                </div>
              </div>
              <div className="outlet-cont overflow-y-scroll">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
