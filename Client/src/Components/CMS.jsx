import { NavLink, Outlet } from "react-router-dom"
import { useContext } from "react";
import LoginContext from "../Context/LoginContext";

export default function CMS() {
  
    let { loggedInUser } = useContext(LoginContext);

    
  
  return (
    <>
      <div className="manage-project-tabs-wrapper">
        <div className="manage-project-tabs equip-tabs-st flex-column flex-md-row">
          <NavLink to="." end>
            {({ isActive }) => (
              <button
                className={
                  isActive ? "project-tab-btn active-tab" : "project-tab-btn"
                }
              >
                Home Carousel
              </button>
            )}
          </NavLink>
          {loggedInUser?.UserRole === "Admin" && (
            <NavLink to="service-req-admin">
              {({ isActive }) => (
                <button
                  className={
                    isActive ? "project-tab-btn active-tab" : "project-tab-btn"
                  }
                >
                  Service Requests
                </button>
              )}
            </NavLink>
          )}
          <NavLink to="admin-photo-gallery">
            {({ isActive }) => (
              <button
                className={
                  isActive ? "project-tab-btn active-tab" : "project-tab-btn"
                }
              >
                Photo Gallery
              </button>
            )}
          </NavLink>
          {loggedInUser?.UserRole === "Admin" && (
            <NavLink to="manage-testimonials">
              {({ isActive }) => (
                <button
                  className={
                    isActive ? "project-tab-btn active-tab" : "project-tab-btn"
                  }
                >
                  Testimonials
                </button>
              )}
            </NavLink>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
