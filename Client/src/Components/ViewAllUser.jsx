import React, { useCallback, useEffect } from "react";
import { ApiRoute } from "./ApiConfig.js";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { uploadUrl } from "../uploadConfig";
import { useApi } from "./ApiCaller.js";
import Swal from "sweetalert2";
export default function ViewAllUsers() {
  const [loading, setLoading] = useState(true);
  const callpi = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [AllUsers, setAllUsers] = useState([]);
const FetchUsersFromDB = async () => {
  try {
    setLoading(true);

    let reqUsers = await fetch(`${ApiRoute}fetch-users`);
    let resAllUsers = await reqUsers.json();

    setAllUsers(resAllUsers);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load users");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    FetchUsersFromDB();
  }, []);

  const removeUser = async (remuseremail, role, name) => {
    console.log("delete user btn clicked");
    
    let result = await Swal.fire({
      title: "Alert",
      text: `Delete User ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DC2626",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete",
      customClass: {
        title: "small-title",
      },
    });

    if (result.isConfirmed) {
      let reqRemoveUser = await callpi(`${ApiRoute}remove-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ remuseremail, role }),
      });

      if (reqRemoveUser.success) {
        console.log(reqRemoveUser.message);
        toast.success(reqRemoveUser.message);
        FetchUsersFromDB();
        FetchUsersFromDB();
      } else {
        toast.error(reqRemoveUser.message);
      }
    }
  };

const filteredUsers = AllUsers.filter(
  (user) =>
    user.User_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.User_Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.User_Role.toLowerCase().includes(searchTerm.toLowerCase()),
);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <div className="container remuser-cont p-3">
        <h4 className="mb-5 d-inline-block py-2">All Users</h4>
        <NavLink to="add-user">
          <button className="defbtn add-u-btn-res-st px-2">+ Add User</button>
        </NavLink>
        <div className="mt-3 mt-md-0 mb-3 d-flex justify-content-between align-items-center">
          <input
            type="text"
            placeholder="Search Users by name, email, or role..."
            className="form-control users-searchtab"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="table-responsive table-wrapper">
          <table className="table cust-table table-bordered users-tbl-style">
            <thead>
              <tr>
                <th className="tbl-head">Sr. No.</th>
                <th className="tbl-head">User Name</th>
                <th className="tbl-head">Email</th>
                <th className="tbl-head">Role</th>
                <th className="tbl-head">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <div className="skeleton-box"></div>
                    </td>
                    <td>
                      <div className="skeleton-box"></div>
                    </td>
                    <td>
                      <div className="skeleton-box"></div>
                    </td>
                    <td>
                      <div className="skeleton-box"></div>
                    </td>
                    <td>
                      <div className="skeleton-btn"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.User_Email}>
                    <td>{index + 1}</td>
                    <td>{user.User_Name}</td>
                    <td>{user.User_Email}</td>
                    <td>{user.User_Role}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          removeUser(
                            user.User_Email,
                            user.User_Role,
                            user.User_Name,
                          )
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
