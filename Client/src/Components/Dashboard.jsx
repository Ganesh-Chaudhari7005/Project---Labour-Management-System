import React, { useContext, useEffect, useState } from "react";
import LoginContext from "../Context/LoginContext";
import { Link, Navigate, NavLink , useLocation} from "react-router-dom";
import { Outlet } from "react-router-dom";
import UserAllDetails from "./DemoUser";
import {toast, ToastContainer} from "react-toastify";
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

const [activeComp, setActivecomp] = useState("Dashboard");
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
    {
      label: "Profile",
      path: "profile",
      icon: FaUserCircle,
    },
    {
      label: "Site Management",
      path: "project-management",
      icon: FaFolderOpen,
    },
    {
      label: "Manage Users",
      path: "manage-users",
      icon: FaUsers,
    },
    {
      label: "Manage Supervisors",
      path: "manage-supervisors",
      icon: FaUserTie,
    },
    {
      label: "Manage Labours",
      path: "manage-labours",
      icon: FaHardHat,
    },
    {
      label: "Manage Wages",
      path: "manage-wages",
      icon: FaMoneyBillWave,
    },
    {
      label: "Attendance",
      path: "Attendance",
      icon: FaCalendarCheck,
    },
    {
      label: "Manage Equipments",
      path: "manage-equipments",
      icon: FaTools,
    },
    {
      label: "CMS",
      path: "cms",
      icon: FaNewspaper,
    },
  ],

  supervisor: [
    {
      label: "Profile",
      path: "profile",
      icon: FaUserCircle,
    },
    {
      label: "Allocated Sites",
      path: "sites-allocated",
      icon: FaClipboardList,
    },
    {
      label: "Manage Labours",
      path: "man-lab-sup-site",
      icon: FaHardHat,
    },
    {
      label: "Attendance",
      path: "labour-attendance",
      icon: FaCalendarCheck,
    },
    {
      label: "Report Site Issues",
      path: "Report-Site-Issues",
      icon: FaQuestionCircle,
    },
    {
      label: "Manage Equipments",
      path: "manage-equipments",
      icon: FaTools,
    },
    {
      label: "CMS",
      path: "cms",
      icon: FaNewspaper,
    },
  ],

  labour: [
    {
      label: "Attendance Report",
      path: "lab-attendance-report",
      icon: FaCalendarCheck,
    },
    {
      label: "Report Issue",
      path: "report-issue",
      icon: FaQuestionCircle,
    },
    {
      label: "Profile",
      path: "profile",
      icon: FaUserCircle,
    },
  ],

  Client: [
    {
      label: "Profile",
      path: "profile",
      icon: FaUserCircle,
    },
    {
      label: "My Projects",
      path: "your-projects",
      icon: FaFolderOpen,
    },
    {
      label: "Billing",
      path: "billing",
      icon: FaReceipt,
    },
    {
      label: "Report Issues",
      path: "report-issues",
      icon: FaQuestionCircle,
    },
    {
      label: "Feedback",
      path: "feedback",
      icon: FaCommentDots,
    },
  ],
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
        navigate("/system-login");
      }
    });
  }

    const allowedFeatures = permissions[loggedInUser?.UserRole] || [];


  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();

    const activeFeature = allowedFeatures.find(
      (item) => item.path === currentPath,
    );

    if (location.pathname === "/dashboard") {
      setActivecomp("Dashboard");
    } else if (activeFeature) {
      setActivecomp(activeFeature.label);
    }
  }, [location.pathname, allowedFeatures]);
  return (
    <div className="dash-cont-outer pb-3">
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
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
                    end
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `${isActive ? "text-black nav-item-active" : "text-white"} adminnavbtn dashboardbtn`
                    }
                  >
                    <MdDashboard className="me-2" />
                    Dashboard
                  </NavLink>
                </div>
                {allowedFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <NavLink
                      key={feature.path}
                      to={feature.path}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `${isActive ? "text-black nav-item-active" : "text-white"} adminnavbtn`
                      }
                    >
                      <Icon className="me-2" />
                      {feature.label}
                    </NavLink>
                  );
                })}
                <div className="log-sec-res-wrapper d-lg-none">
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
