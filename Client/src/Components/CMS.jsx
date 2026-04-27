import { NavLink, Outlet } from "react-router-dom"

export default function CMS() {
  return (
    <>
      <div className="d-flex gap-3 photo-nav-cont">
        <NavLink to="." end>
          {({ isActive }) => (
            <button
              className={`equip-btn
                      ${isActive ? "admin-nav-btn" : "text-white"}`}
            >
              Home Carousel
            </button>
          )}
        </NavLink>
        <NavLink to="service-req-admin">
          {({ isActive }) => (
            <button
              className={`equip-btn
                      ${isActive ? "admin-nav-btn" : "text-white"}`}
            >
              Service Requests
            </button>
          )}
        </NavLink>
        <NavLink to="admin-photo-gallery">
          {({ isActive }) => (
            <button
              className={`equip-btn
                      ${isActive ? "admin-nav-btn" : "text-white"}`}
            >
              Photo Gallery
            </button>
          )}
        </NavLink>

        <NavLink to="manage-testimonials">
          {({ isActive }) => (
            <button
              className={`equip-btn
                      ${isActive ? "admin-nav-btn" : "text-white"}`}
            >
              Testimonials
            </button>
          )}
        </NavLink>
      </div>
      <Outlet />
    </>
  );
}
