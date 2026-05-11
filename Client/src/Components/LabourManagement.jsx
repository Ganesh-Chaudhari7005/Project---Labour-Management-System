import React from 'react'
import { Outlet, NavLink } from 'react-router-dom';
export default function LabourManagement() {
  return (
    <div className="h-100 w-100 admin-comp-def global-page-anim">
      <div className='d-flex gap-2'>
        <NavLink to="." end>
          {({ isActive }) => (
            <button className={isActive ? "admin-nav-btn" : "rounded"}>
              All labours
            </button>
          )}
        </NavLink>
        <NavLink to="assign-labours">
          {({ isActive }) => (
            <button className={isActive ? "admin-nav-btn" : "rounded"}>
              Assign Labours
            </button>
          )}
        </NavLink>
        <NavLink to="add-labour">
          {({ isActive }) => (
            <button className={isActive ? "admin-nav-btn" : "rounded"}>
              Add Labours
            </button>
          )}
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
