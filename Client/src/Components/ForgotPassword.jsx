import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { ApiRoute } from "./ApiConfig";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Enter email");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Enter a valid email");
    }

    if (cooldown) {
      return toast.error("Please wait before retrying");
    }

    setLoading(true);

    try {
      const res = await fetch(`${ApiRoute}forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      // 🔐 secure generic response handling
      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }


      setSent(true);

      // ⏳ cooldown to prevent spam
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
    } catch (err) {
      console.error(err);
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown) return;

    setSent(false);
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="forgot-container">
        {/* LEFT SIDE */}
        <div className="forgot-left">
          <img src="public/forgot-password.jpg" alt="forgot" />
        </div>

        {/* RIGHT SIDE */}
        <div className="forgot-right">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="forgot-card"
              >
                <h2 className="mb-3">Forgot Your Password?</h2>

                <p className="hint-text">
                  We’ll send you a secure reset link valid for 10 minutes
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="input-group mb-4">
                    <span className="icon">📧</span>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="reset-btn mb-3"
                    disabled={loading || cooldown}
                  >
                    {loading ? "SENDING..." : "SEND RESET LINK"}
                  </button>
                </form>

                <p className="back-login" onClick={() => navigate("/admin")}>
                  Back To SIGN IN
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="forgot-card text-center"
              >
                <h2>📩 Check Your Email</h2>

                <p className="hint-text">
                  If an account exists for <b>{email}</b>, you’ll receive a
                  reset link shortly.
                </p>

                <button
                  className="reset-btn mb-3"
                  onClick={handleResend}
                  disabled={cooldown}
                >
                  {cooldown ? "WAIT..." : "RESEND EMAIL"}
                </button>

                <p className="back-login" onClick={() => navigate("/admin")}>
                  Back To SIGN IN
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .forgot-container {
          display: flex;
          min-height: 100vh;
        }

        .forgot-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        

        .forgot-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
        }

        .forgot-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          text-align: center;
        }

        .hint-text {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .input-group {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 10px;
        }

        .input-group input {
          border: none;
          outline: none;
          flex: 1;
          padding: 5px;
        }

        .icon {
          margin-right: 8px;
        }

        .reset-btn {
          width: 100%;
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

        .back-login {
          margin-top: 10px;
          color: #2563eb;
          cursor: pointer;
          font-weight: 500;
        }
      `}</style>
    </motion.div>
  );
}
