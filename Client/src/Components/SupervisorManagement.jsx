import { Outlet, NavLink } from 'react-router-dom';
export default function SupervisorManagement() {
  return (
    <div className="h-100 w-100 admin-comp-def global-page-anim">
      <div className="d-flex gap-2">
        <NavLink to="." end>
          {({ isActive }) => (
            <button className={isActive ? "admin-nav-btn" : "rounded"}>
              All Supervisors
            </button>
          )}
        </NavLink>
        <NavLink to="assign-supervisor">
          {({ isActive }) => (
            <button className={isActive ? "admin-nav-btn" : "rounded"}>
              Assign Supervisors
            </button>
          )}
        </NavLink>
        <NavLink to="add-supervisor">
          {({ isActive }) => (
            <button className={isActive ? "admin-nav-btn" : "rounded"}>
              Add Supervisors
            </button>
          )}
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
