import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { ApiRoute } from "./ApiConfig";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔥 password strength logic
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    return score;
  };

  const strength = getStrength(password);

  const strengthLabel = ["Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

  const handleReset = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch(`${ApiRoute}reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success(
        data.message || "Password updated! Redirecting to login...",
      );

      setPassword("");
      setConfirmPassword("");

      // 🚀 redirect after short delay
      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="reset-bg">
      <ToastContainer />
      <div className="row g-0 h-100">
        <div className="col-lg-6">
          <div className="reset-img-cont">
            <img src="./resetimg.jpg" alt="" />
          </div>
        </div>
        <div className="col-lg-6">
          <div className="reset-card-cont">
            <div className="reset-card">
              <h2 className="reset-title">Reset Password</h2>
              <p className="reset-subtitle">
                Create a strong password for your account
              </p>

              <form onSubmit={handleReset} className="reset-form">
                {/* PASSWORD */}
                <div className="input-group">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="New password"
                    className="reset-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁️"}
                  </span>
                </div>

                {/* 🔥 STRENGTH BAR */}
                {password && (
                  <div className="strength-wrapper">
                    <div className="strength-bar-bg">
                      <div
                        className="strength-bar"
                        style={{
                          width: `${(strength / 4) * 100}%`,
                          background: strengthColor[strength - 1] || "#ef4444",
                        }}
                      />
                    </div>
                    <small
                      style={{
                        color: strengthColor[strength - 1] || "#ef4444",
                      }}
                    >
                      {strengthLabel[strength - 1] || "Very Weak"}
                    </small>
                  </div>
                )}

                {/* CONFIRM PASSWORD */}
                <div className="input-group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    className="reset-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="eye"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </span>
                </div>

                {/* MATCH INDICATOR */}
                {confirmPassword.length > 0 && (
                  <small
                    style={{
                      color: passwordsMatch ? "#22c55e" : "#ef4444",
                      fontWeight: 600,
                    }}
                  >
                    {passwordsMatch
                      ? "✔ Passwords match"
                      : "✖ Passwords do not match"}
                  </small>
                )}

                <button className="reset-btn" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
     

        .reset-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          text-align: center;
        }

        .reset-title {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }

        .reset-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .reset-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input-group {
          position: relative;
        }

        .reset-input {
          width: 100%;
          padding: 12px 40px 12px 14px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          font-size: 15px;
          outline: none;
        }

        .eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 18px;
        }

        .strength-wrapper {
          text-align: left;
          margin-top: -8px;
        }

        .strength-bar-bg {
          height: 6px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .strength-bar {
          height: 100%;
          transition: 0.3s;
        }

        .reset-btn {
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: #22c55e;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .reset-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
.reset-card-cont {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background : #f9fafb;
}
        .reset-bg{
          height : 100%;
        }

        .reset-img-cont img{
        width : 100%;}

        .reset-img-cont {
    height: 100%;
    display: flex;
    align-items: center;
}
      `}</style>
    </div>
  );
}
