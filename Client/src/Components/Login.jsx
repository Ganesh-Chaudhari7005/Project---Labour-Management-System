import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginContext from "../Context/LoginContext";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [userEmail, setUserEmial] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { setLoggedInUser } = useContext(LoginContext);
  const validateDetails = (e) => {
    e.preventDefault();
    const trimuserEmail = userEmail.trim();
    const trimpass = userPassword.trim();
    if (!trimuserEmail || !trimpass) {
      toast.error("Enter Credentials");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimuserEmail)) {
      toast.error("Please enter a valid email address.");
    } else {
      handleLogin(trimuserEmail, trimpass);
    }
  };

  const handleLogin = async (loginUserEmail, loginUserPassword) => {
    const request = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ loginUserEmail, loginUserPassword }),
    });

    const data = await request.json();
    if (data.success) {

      const user = {
        UserEmail : data.uemail,
        UserName : data.funame,
        Address : data.uaddr,
        Phone : data.uphone,
        UserRole : data.urole,
        UserImgPath : data.profileimgpath
      }

      setLoggedInUser(user)
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", data.token);
      toast.success(data.message);
      navigate("/dashboard");
  
  
    } else {
      toast.error(data.message);
    }
  };
  return (
    <>
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <div className="login-container">
        <div className="container-fluid h-100 w-100">
          <div className="row h-100">
            <div className="col-lg-6 h-100 login-left d-none d-lg-block">
              <div className="h-100 d-flex flex-column justify-content-center">
                {/* <h1 className="text-white">Royal Enterprises</h1> */}
                <h3 className="text-white">
                  Project and Labour Management System
                </h3>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="login-cont h-100 w-100">
                <div className="login-inner-cont">
                  <h1 className="text-center">Login</h1>
                  <form className="p-5" onSubmit={validateDetails}>
                    <label className="loginlabel pb-3" htmlFor="loginuser101">
                      Enter Email :
                    </label>
                    <br />
                    <input
                      className="loginfields"
                      id="loginuser101"
                      type="text"
                      required={true}
                      value={userEmail}
                      onChange={(e) => setUserEmial(e.target.value)}
                    />
                    <br />
                    <label className="loginlabel py-3" htmlFor="loginpass12">
                      Enter Password :
                    </label>
                    <br />
                    <input
                      id="loginpass12"
                      required={true}
                      type={showPass ? "text" : "password"}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="loginfields mb-5"
                    />

                    <input
                      type="checkbox"
                      className="logincheckbox"
                      checked={showPass ? true : false}
                      onChange={() => {
                        setShowPass((prev) => !prev);
                      }}
                    />
                    <label className="loginlabel mx-2 mb-5">
                      Show Password
                    </label>
                    <br />

                    <button type="submit" className="loginbtn">
                      Login
                    </button>
                    <br />
                    <br />
                    <p className="text-center py-2">Forgot Password ?</p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
