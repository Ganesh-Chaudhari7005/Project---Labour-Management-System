import React, { useContext, useState } from "react";
import LoginContext from "../Context/LoginContext";
import { motion } from "framer-motion";
export default function Profile() {
  const { loggedInUser } = useContext(LoginContext);
  const [isdisabled, setDisabled] = useState(true);
  const [profilename, setProfileName] = useState(loggedInUser.UserName);
  const [profileEmail, setProfileEmail] = useState(loggedInUser.Email);
  const [profilePhone, setProfilePhone] = useState(loggedInUser.Phone);
  const [profileAddr, setProfileAddr] = useState(loggedInUser.Address);
  const HandleFormStatus = () => {};
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-100 w-100 admin-comp-def global-page-anim">
        <div className="container">
          <div className="row">
            <div className="col-lg-2">
              <div className="profile-pic-cont">
                <img src="/defaultprofile.png" />
              </div>
            </div>
            <div className="col-lg-10">
              <br />
              <br />
              <h3>{loggedInUser.UserName}</h3>
              <p className="profile-role-text">{loggedInUser.Role}</p>
              <button className="edit-prof-btn">Edit Profile</button>
            </div>
          </div>
          <div className="profile-det-from px-5">
            <form>
              <div className="profile-info-cont">
                <div className="formdivs">
                  <label className="loginlabel pb-2">Full Name:</label>
                  <br />
                  <input
                    disabled={isdisabled}
                    type="text"
                    value={profilename}
                    className="mb-2 p-2 custom-text profile-fields"
                  />
                </div>
                <div className="formdivs">
                  <label className="loginlabel pb-2">Email :</label>
                  <br />
                  <input
                    disabled={isdisabled}
                    type="text"
                    value={profileEmail}
                    className="mb-2 p-2 custom-text profile-fields"
                  />
                </div>
                <div className="formdivs">
                  <label className="loginlabel pb-2">Phone :</label>
                  <br />
                  <input
                    disabled={isdisabled}
                    type="text"
                    value={profilePhone}
                    className="mb-2 p-2 custom-text profile-fields"
                  />
                </div>
                <div className="formdivs">
                  <label className="loginlabel pb-2">Address :</label>
                  <br />
                  <input
                    disabled={isdisabled}
                    type="text"
                    value={profileAddr}
                    className="mb-2 p-2 custom-text profile-fields"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
