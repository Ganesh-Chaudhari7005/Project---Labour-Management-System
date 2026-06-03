import React , {useState, useEffect} from "react";
import { Outlet, useParams, NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { useApi } from "./ApiCaller";
import { ApiRoute } from "./ApiConfig";

export default function ManageProject() {
  const { id } = useParams();
    const callApi = useApi();
  
  const [ProjectName, setProjectName] = useState();

   useEffect(() => {
      getProjectDetails();
    }, []);
  

  const getProjectDetails = async () => {
      console.log("Sending ID:", id, typeof id);
      const reqPrj = await callApi(`${ApiRoute}getProject-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
  
      console.log(reqPrj);
  
      setProjectName(reqPrj.projectdetails.ProjectName);
    };
  const tabs = [
    {
      name: "Dashboard",
      path: ".",
      end: true,
      icon: "ri-dashboard-line",
    },
    {
      name: "Manage Work",
      path: "manage-prj-work",
      icon: "ri-tools-line",
    },
    {
      name: "Generate Bill",
      path: "generate-bill",
      icon: "ri-file-list-3-line",
    },
    {
      name: "View Bills",
      path: "view-past-bills",
      icon: "ri-money-rupee-circle-line",
    },
    {
      name: "Project Details",
      path: "project-details",
      icon: "ri-folder-info-line",
    },
  ];

  return (
    <motion.div
      className="manage-project-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />

      <div className="container">
        {/* Header */}
        <div className="project-top-section">
          <div className="project-header-card">
            <div className="project-header-left">
              <div className="project-badge">
                <i className="ri-building-line"></i>
                Active Project
              </div>

              <h1>{ProjectName}</h1>
            </div>

            

            {/* Decorative Elements */}
            <div className="project-bg-circle one"></div>
            <div className="project-bg-circle two"></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="manage-project-tabs-wrapper">
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
                      isActive
                        ? "project-tab-btn active-tab"
                        : "project-tab-btn"
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

        {/* Page Content */}
        <div className="project-content-area">
          <Outlet />
        </div>
      </div>
    </motion.div>
  );
}
