import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { ApiRoute } from "./ApiConfig";
export default function AddUsers() {
  const [newUserName, setNewUser] = useState(null);
  const [newUserEmail, setNewUserEmial] = useState(null);
  const [newUserRole, setNewUserRole] = useState("Admin");
  const [newUserPassword1, setNewUserPassword1] = useState(null);
  const [newUserPassword2, setNewUserPassword2] = useState(null);
  const [passworState, setPasswordState] = useState(false);

  const TogglePassword = () => {
    setPasswordState((prev) => (prev = !prev));
  };

  const ValidateUserDetails = (e) => {
    e.preventDefault();
    let trimUserName = newUserName.trim();
    let trimUserEmail = newUserEmail.trim();
    let trimUserPass1 = newUserPassword1.trim();
    let trimUserPass2 = newUserPassword2.trim();

    if (
      !trimUserName ||
      !trimUserEmail ||
      !trimUserPass1 ||
      !trimUserPass2
    ) {
      toast.error("Please fill in all required fields.");
    }  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimUserEmail)) {
      toast.error("Please enter a valid email address.");
    } else if (trimUserPass1 !== trimUserPass2) {
      toast.error("Passwords do not match.");
    } else if (trimUserPass1.length < 8) {
      toast.error("Password must be at least 8 characters long");
    } else {
      HandleAddNewUser(
        trimUserName,
        trimUserEmail,
        trimUserPass1,
        newUserRole
      );
    }
  };

  const HandleAddNewUser = async (addUName, addUEmail, addUPass, addURole) => {
    const addUserRequest = await fetch(
      `
      ${ApiRoute}add-new-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addUName, addUEmail , addUPass, addURole }),
      },
    );

    let addUserResponce = await addUserRequest.json();
    console.log(addUserResponce);
    if(addUserResponce.success){
        toast.success("User Added");
    }else{
      toast.error(addUserResponce.message);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container py-3 px-4">
        <ToastContainer
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />
        <h4 className="mb-4">Add User</h4>
        <form onSubmit={(e) => ValidateUserDetails(e)}>
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

            <div className="formdivs cust-add-user-formdiv">
              <label className="loginlabel pb-2">Password :</label>
              <br />
              <input
                onChange={(e) => {
                  setNewUserPassword1(e.target.value);
                }}
                required={true}
                type={`${passworState ? "text" : "password"}`}
                value={newUserPassword1}
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
                type={`${passworState ? "text" : "password"}`}
                value={newUserPassword2}
                className="mb-2 p-2 custom-text profile-fields"
              />
            </div>
            <div className="formdivs cust-add-user-formdiv d-flex align-items-center">
              <div className="chechinner d-flex align-items-center position-relative">
                <input type="checkbox" onChange={() => TogglePassword()} />
                <label className="loginlabel">Show password</label>
              </div>
            </div>
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

          <button type="submit" className="save-prof-btn mt-5 px-4">
            Add User
          </button>
        </form>
      </div>
    </motion.div>
  );
}
