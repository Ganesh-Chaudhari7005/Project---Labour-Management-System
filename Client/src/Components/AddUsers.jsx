import React, { use } from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
export default function AddUsers() {
    const [newUserName, setNewUser] = useState(null);
    const [newUserEmail, setNewUserEmial]  = useState(null);
    const [newUserRole, setNewUserRole] = useState(null);
    const [newPhoneNumber , setNewPhoneNumber] = useState(null);
    const [newUserPassword1, setNewUserPassword1] = useState(null);
    const [newUserPassword2, setNewUserPassword2] = useState(null);
  return (
    <div className="container py-3 px-4">
      <h4 className="mb-4">Add User</h4>
      <form onSubmit={() => ValProfileUpdate(e)}>
        <div className="profile-info-cont">
          <div className="formdivs mb-3">
            <label className="loginlabel pb-2">Full Name:</label>
            <br />
            <input
              onChange={(e) => {
                setNewUser(e.target.value);
              }}
              required={true}
              type="text"
              value={newUserName}
              className="text-capitalize mb-2 p-2 custom-text profile-fields"
            />
          </div>
          <div className="formdivs mb-3">
            <label className="loginlabel pb-2">Email :</label>
            <br />
            <input
              onChange={(e) => {
                setNewUserEmial(e.target.value);
              }}
              required={true}
              type="email"
              value={newUserEmail}
              className="mb-2 p-2 custom-text profile-fields"
            />
          </div>
          <div className="formdivs mb-3">
            <label className="loginlabel pb-2">Phone :</label>
            <br />
            <input
              onChange={(e) => {
                setNewPhoneNumber(e.target.value);
              }}
              required={true}
              type="text"
              value={newPhoneNumber}
              className="mb-2 p-2 custom-text profile-fields"
            />
          </div>
          <div className="formdivs">
            <label className="loginlabel pb-2">Select Role :</label>
            <br />
            <select
              className="adduserselect"
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <option value={"Admin"}>Admin</option>
              <option value={"Supervisor"}>Supervisor</option>
              <option value={"Client"}>Client</option>
              <option value={"Labour"}>Labour</option>
            </select>
          </div>
          <div className="formdivs cust-add-user-formdiv">
            <label className="loginlabel pb-2">Password :</label>
            <br />
            <input
              onChange={(e) => {
                setNewUserPassword1(e.target.value);
              }}
              required={true}
              type=""
              value={newPhoneNumber}
              className="mb-2 p-2 custom-text profile-fields"
            />
          </div>
          <div className="formdivs cust-add-user-formdiv">
            <label className="loginlabel pb-2">Confirm Password :</label>
            <br />
            <input
              onChange={(e) => {
                setNewUserPassword2(e.target.value);
              }}
              required={true}
              type="text"
              value={newPhoneNumber}
              className="mb-2 p-2 custom-text profile-fields"
            />
          </div>
          <div className="formdivs cust-add-user-formdiv d-flex align-items-center">
            <div className="chechinner d-flex align-items-center position-relative">
              <input type="checkbox" />
              <label className="loginlabel">Show password</label>
            </div>
          </div>
        </div>
        <button type="submit" className="save-prof-btn mt-5 px-4">
          Add User
        </button>
      </form>
    </div>
  );
}
