import React from 'react'
import { NavLink } from 'react-router-dom';
export default function ViewAllLabour() {
  return (
    <div className="container remuser-cont p-3">
      <h4 className="mb-5 d-inline-block">All Labours</h4>

      <NavLink to="add-labour">
        <button className="defbtn">+ Add Labour</button>
      </NavLink>
    </div>
  );
}
