import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
export default function SupMangLabCont() {
     const tabs = [
       {
         name: "All Labours",
         path: ".",
         end: true,
         icon: "ri-dashboard-line",
       },
       {
         name: "Remove Labours",
         path: "rem-lab-sup-st",
         icon: "ri-tools-line",
       },
     ];
  return (
    <>
      <div className="manage-project-tabs-wrapper">
        <div className="manage-project-tabs">
          {tabs.map((tab, index) => (
            <NavLink
              key={index}
              to={tab.path}
              end={tab.end}
              className="navlink-reset att-tabs-res"
            >
              {({ isActive }) => (
                <button
                  className={
                    isActive ? "project-tab-btn active-tab" : "project-tab-btn"
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
      <Outlet/>
    </>
  );
}
