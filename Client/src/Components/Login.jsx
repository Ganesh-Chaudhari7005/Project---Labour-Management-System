import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginContext from "../Context/LoginContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const navigate = useNavigate();

  const [userEmail, setUserEmial] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setLoggedInUser } = useContext(LoginContext);

  const validateDetails = (e) => {
    e.preventDefault();

    const email = userEmail.trim();
    const pass = userPassword.trim();

    if (!email || !pass) {
      return toast.error("Enter credentials");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("Enter valid email");
    }

    handleLogin(email, pass);
  };

  const handleLogin = async (loginUserEmail, loginUserPassword) => {
    setLoading(true);

    try {
      const request = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginUserEmail, loginUserPassword }),
      });

      const data = await request.json();

      if (data.success) {
        Swal.fire({
          title: "Login Successful!",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });

        const user = {
          UserEmail: data.uemail,
          UserName: data.funame,
          Address: data.uaddr,
          Phone: data.uphone,
          UserRole: data.urole,
          UserImgPath: data.profileimgpath,
        };

        setLoggedInUser(user);
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", data.token);

        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer/>
      <motion.div
        className="login-wrapper"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="login-container">
          {/* LEFT SIDE */}
          <div className="login-left">
            <img src="public/login (2).jpg" alt="" />
           
          </div>

          {/* RIGHT SIDE */}
          <div className="login-right">
            <div className="login-card">
              <h2 className="title">Royal Enterprises</h2>
              <h3 className="title mb-3">Login</h3>
              <p className="subtitle">Sign in to continue</p>

              <form onSubmit={validateDetails}>
                {/* EMAIL */}
                <div className="field">
                  <label>Email</label>
                  <input
                    type="text"
                    value={userEmail}
                    onChange={(e) => setUserEmial(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>

                {/* PASSWORD */}
                <div className="field">
                  <label>Password</label>

                  <div className="password-box">
                    <input
                      type={showPass ? "text" : "password"}
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      placeholder="Enter password"
                    />

                    <span
                      className="eye"
                      onClick={() => setShowPass(!showPass)}
                    >
                      {showPass ? "🙈" : "👁️"}
                    </span>
                  </div>
                </div>

                {/* OPTIONS */}
                <div className="options">
                  <label>
                    <input
                      type="checkbox"
                      checked={showPass}
                      onChange={() => setShowPass((p) => !p)}
                    />
                    Show password
                  </label>

                  <span
                    onClick={() => navigate("/forgot-password")}
                    className="forgot"
                  >
                    Forgot password?
                  </span>
                </div>

                {/* BUTTON */}
                <button className="login-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
        }

        .login-container {
          display: flex;
          width: 100%;
        }

        .features {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  background: rgba(255,255,255,0.1);
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  backdrop-filter: blur(10px);
  transition: 0.3s;
}

.feature-item:hover {
  transform: translateX(5px);
  background: rgba(255,255,255,0.2);
}
  
        .login-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary);
          color: white;
            position: relative;

        }

        .brand-box h2 {
          font-size: 28px;
        }

        .brand-box p {
          opacity: 0.7;
        }

        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          flex-direction : column;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }

        .title {
          margin-bottom: 5px;
        }

        .subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .field {
          margin-bottom: 15px;
        }

        .field label {
          font-size: 13px;
          font-weight: 500;
          display: block;
          margin-bottom: 6px;
        }

        .field input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
        }

        .password-box {
          position: relative;
        }

        .eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }

        .options {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .forgot {
          color: #2563eb;
          cursor: pointer;
        }

        .login-btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: #22c55e;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .login-btn:disabled {
          opacity: 0.6;
        }

        
      `}</style>
      </motion.div>
    </>
  );
}
