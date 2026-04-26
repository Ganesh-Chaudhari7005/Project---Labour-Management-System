import React from 'react'
import { ToastContainer } from 'react-toastify'
import { NavLink } from 'react-router-dom';
import { useState , useEffect} from 'react';
import {ApiRoute} from "./ApiConfig.js"
import ManageProject from './ManageProject.jsx';
export default function Project() {
  const [projects , setProjects] = useState([]);
  const FetchLaboursFromDB = async () => {
      let reqPrj = await fetch(`${ApiRoute}fetch-projects`);
  
      let res = await reqPrj.json();
      setProjects(res);
      
    };
    useEffect(() => {
      FetchLaboursFromDB();
    }, []);


  

  return (
    <>
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <div className="container p-3 position-relative">
        <NavLink to="create-project">
          <button className="defbtn px-2">+ New Project</button>
        </NavLink>

        <h4 className="mb-5 d-inline-block">All Projects</h4>

        <div className="row">
          {projects.map((data, index) => (
            <div className="col-lg-3">
              <div className="card p-0" style={{ width: "18rem" }}>
                <div className="card-body project-card-cont">
                  <h5 className="card-title">{data.ProjectName}</h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">
                    Status- {data.Status}
                  </h6>

                  <NavLink to={`manage-project/${data.ProjectID}`}>
                    <button className="save-prof-btn px-2">
                      Manage project
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
