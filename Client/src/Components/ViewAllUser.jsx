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
  const callpi = useApi();
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

  // const getProfilePic = async(email, role)=>{
  //     let reqImg = await fetch(`${ApiRoute}getProfilePicture`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email, role })
  //     });
  //           console.log("Api called");

  //     let resofImg = await reqImg.json();
  //     console.log(resofImg);
  //     let fullImgPath = `${uploadUrl}${resofImg[0].profileImgPath}`;
  //     return fullImgPath;

  // }
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
        <h4 className="mb-5 d-inline-block">All Users</h4>
        <NavLink to="add-user">
          <button className="defbtn px-2">+ Add User</button>
        </NavLink>
        <div className="table-responsive table-wrapper">
          <table className="table cust-table">
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
              {AllUsers.map((user, index) => (
                <tr>
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
              ))}
            </tbody>
          </table>
        </div>
        {/* <div className="row">
          {AllUsers.map((user, index) => (
            <div className="col-lg-3">
              <div
                className="card"
                key={index}
                style={{ width: "15rem", height: "18rem" }}
              >
                <div className="imgcont overflow-hidden">
                  <img
                    src={`${uploadUrl}${user.profileImgPath}`}
                    className="card-img-top"
                    alt="..."
                    onError={(e) => {
                      e.target.src = "/public/defaultprofile.png";
                    }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{user.User_Name}</h5>
                  <p className="card-text">{user.User_Role}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeUser(user.User_Email, user.User_Role)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </motion.div>
  );
}
