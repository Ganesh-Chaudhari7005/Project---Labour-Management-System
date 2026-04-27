import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Tiles404Page() {
  const navigate = useNavigate();

  return (
    <div className="tiles404-light-wrapper">
      <motion.div
        className="tiles404-light-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Tile Icon */}
        <motion.div
          className="tiles404-light-icon"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <svg
            width="70"
            height="70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9aa0a6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.div>

        <h1 className="tiles404-light-code">404</h1>
        <h4 className="tiles404-light-title">Page Not Found</h4>
        <p className="tiles404-light-text">
          This page doesn’t exist or may have been moved.
        </p>

        <div className="tiles404-light-actions">
          <button
            className="tiles404-light-btn-main"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>

          <button
            className="rounded"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
