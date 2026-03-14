import React from 'react'
import { ToastContainer } from 'react-toastify'
import { NavLink } from 'react-router-dom';
export default function Project() {
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

        <h1>Project</h1>
      </div>
    </>
  );
}
