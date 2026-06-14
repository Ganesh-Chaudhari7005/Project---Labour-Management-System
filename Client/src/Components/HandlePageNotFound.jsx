import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Tiles404Page() {
  const navigate = useNavigate();

  return (
    <div className="tiles404-wrapper">
      <motion.div
        className="tiles404-card"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="tiles404-icon"
          animate={{
            rotate: [0, -5, 5, -5, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
        >
          <i className="bi bi-cone-striped"></i>
        </motion.div>

        <div className="tiles404-badge">ERROR 404</div>

        <h1 className="tiles404-title">Page Not Found</h1>

        <p className="tiles404-text">
          The page you're looking for doesn't exist, may have been moved, or the
          URL might be incorrect.
        </p>

        <div className="tiles404-info">
          <div>
            <span>Status</span>
            <strong>Not Found</strong>
          </div>

          <div>
            <span>Requested URL</span>
            <strong>{window.location.pathname}</strong>
          </div>
        </div>

        <div className="tiles404-actions">
          <button className="tiles404-btn-primary" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i>
            Go Back
          </button>


          <button
            className="tiles404-btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            <i className="bi bi-speedometer2"></i>
            Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
