import React, { useCallback, useEffect } from "react";
import { ApiRoute } from "./ApiConfig";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function ViewAllUsers() {
  const [AllUsers, setAllUsers] = useState([]);

  const FetchUsersFromDB = async () => {
    let reqUsers = await fetch(`${ApiRoute}fetch-users`);
    let resAllUsers = await reqUsers.json();
    setAllUsers(resAllUsers);
    console.log(resAllUsers);
  };
  useEffect(() => {
    FetchUsersFromDB();
  }, []);

  const removeUser = async (remusername) => {
    console.log(remusername);
    let reqRemoveUser = await fetch(`${ApiRoute}remove-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ remusername }),
    });

    let remuserResponce = await reqRemoveUser.json();
    if (remuserResponce.success) {
      toast.success(remuserResponce.message);
      FetchUsersFromDB();
    } else {
      toast.error(remuserResponce.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container remuser-cont p-3">
        <h4 className="mb-5 d-inline-block">All Users</h4>
        <NavLink to="add-user">
          <button className="adduserbnt px-2">+ Add User</button>
        </NavLink>
        <div className="table-responsive table-wrapper">
          <table className="table cust-table table-bordered">
            <thead>
              <tr>
                <th className="tbl-head">Sr. No.</th>
                <th className="tbl-head">User Name</th>
                <th className="tbl-head">Email</th>
                <th className="tbl-head">Role</th>
                <th className="tbl-head">Created On</th>
                <th className="tbl-head">Action</th>
              </tr>
            </thead>
            <tbody>
              {AllUsers.map((user, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{user.runame}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.username}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeUser(user.username)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
