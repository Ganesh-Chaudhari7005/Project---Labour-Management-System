import React, { useContext, useState } from "react";
import LoginContext from "../Context/LoginContext";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { ApiRoute } from "./ApiConfig";
import { uploadUrl } from "../uploadConfig";
export default function Profile() {
  const { loggedInUser, setLoggedInUser } = useContext(LoginContext);
  const [isdisabled, setDisabled] = useState(true);
  const [isavebtnVisible, setSavebtn] = useState(false);
  const [profilename, setProfileName] = useState(loggedInUser.UserName);
  const [profileEmail, setProfileEmail] = useState(loggedInUser.Email);
  const [profilePhone, setProfilePhone] = useState(loggedInUser.Phone);
  const [profileAddr, setProfileAddr] = useState(loggedInUser.Address);
  const[profileImage2 , setProfileImage] = useState('');
  const HandleFormStatus = () => {
    setDisabled((prev) => !prev);
  };

  const ValProfileUpdate = (e) => {
    e.preventDefault();
    const trimProfilename = profilename.trim();
    const trimEmail = profileEmail.trim();
    const trimePhone = profilePhone.trim();
    const trimAddr = profileAddr.trim();

    if (!trimProfilename || !trimEmail || !trimePhone || !trimAddr) {
      toast.error("Fill All Details");
    } else if(trimePhone.length > 10 || trimePhone.length < 10){
        toast.error("Enter a Valid Phone Number");
    }else {
      HandleProfileUpdate();
    }
  };

  const HandleProfileUpdate = async () => {
    const currentUserEmail = loggedInUser.Email;
    let roleInfo = loggedInUser.Role;

    const formData = new FormData();

    formData.append("profilename", profilename);
    formData.append("profileEmail", profileEmail);
    formData.append("profilePhone", profilePhone);
    formData.append("profileAddr", profileAddr);
    formData.append("currentUserEmail", currentUserEmail);
    formData.append("roleInfo", roleInfo);

    formData.append("profileimage", profileImage2);
    const reqProfileUpdate = await fetch(
      `
      ${ApiRoute}update-profile`,
      {
        method: "POST",
        body : formData
       
      },
    );

    const resjsondata = await reqProfileUpdate.json();
    console.log(resjsondata);
    if (resjsondata.success) {
      if (resjsondata.UpdatedImgPath){    
      setLoggedInUser({
        ...loggedInUser,
        UserName: profilename,
        Address: profileAddr,
        Phone: profilePhone,
        Email: profileEmail,
        ProfileImage: resjsondata.UpdatedImgPath,
      });
      }else{
        setLoggedInUser({
          ...loggedInUser,
          UserName: profilename,
          Address: profileAddr,
          Phone: profilePhone,
          Email: profileEmail,
        });
      } 
      toast.success(resjsondata.message);
    } else {
      toast.error(resjsondata.message);
    }
  };

  const setSaveBtnState = () => {
    setSavebtn((prev) => prev =true);
  };
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
      <div className="h-100 w-100 admin-comp-def global-page-anim">
        <div className="container p-3">
          <div className="row">
            <div className="col-lg-2 d-flex justify-content-center">
              <div className="profile-pic-cont">
                <img src={`${uploadUrl}${loggedInUser.ProfileImage}`} />
              </div>
            </div>
            <div className="col-lg-10">
              <br />
              <br />
              <h3>{loggedInUser.UserName}</h3>
              <p className="profile-role-text">{loggedInUser.Role}</p>
              <button
                className="edit-prof-btn"
                onClick={() => HandleFormStatus()}
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div className="profile-det-from px-5">
            <form onSubmit={ValProfileUpdate}>
              <div className="profile-info-cont">
                <div className="formdivs">
                  <label className="loginlabel pb-2">Full Name:</label>
                  <br />
                  <input
                    onChange={(e) => {
                      setProfileName(e.target.value);
                      setSaveBtnState();
                    }}
                    required={true}
                    disabled={isdisabled}
                    type="text"
                    value={profilename}
                    className="text-capitalize mb-2 p-2 custom-text profile-fields"
                  />
                </div>
                <div className="formdivs">
                  <label className="loginlabel pb-2">Email :</label>
                  <br />
                  <input
                    onChange={(e) => {
                      setProfileEmail(e.target.value);
                      setSaveBtnState();
                    }}
                    required={true}
                    disabled={isdisabled}
                    type="email"
                    value={profileEmail}
                    className="mb-2 p-2 custom-text profile-fields"
                  />
                </div>
                <div className="formdivs">
                  <label className="loginlabel pb-2">Phone :</label>
                  <br />
                  <input
                    onChange={(e) => {
                      setProfilePhone(e.target.value);
                      setSaveBtnState();
                    }}
                    required={true}
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
                    onChange={(e) => {
                      setProfileAddr(e.target.value);
                      setSaveBtnState();
                    }}
                    required={true}
                    disabled={isdisabled}
                    type="text"
                    value={profileAddr}
                    className="mb-2 p-2 custom-text profile-fields"
                  />
                </div>
                <div className="formdivs">
                  <label className="loginlabel pb-2">Profile Picture :</label>
                  <br />
                  <input
                    onChange={(e) => {
                      setProfileImage(e.target.files[0]);
                      setSaveBtnState();
                    }}
                    style={{
                      paddingTop: "4px",
                      paddingLeft: "4px",
                      height: "40px",
                    }}
                    disabled={isdisabled}
                    type="file"
                    className="custom-text profile-fields"
                  />
                </div>
              </div>
              <button
                style={{
                  visibility: `${isavebtnVisible ? "visible" : "hidden"}`,
                }}
                type="submit"
                onClick={(e) => ValProfileUpdate(e)}
                className="save-prof-btn mt-5"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
