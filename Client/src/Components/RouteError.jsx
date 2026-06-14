import { useRouteError, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
export default function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="admin-error-page">
        <div className="admin-error-card">
          <div className="admin-error-header">
            <div className="admin-error-icon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>

            <div>
              <h2>System Error</h2>
              <p>The application encountered an unexpected error.</p>
            </div>
          </div>

          <div className="admin-error-body">
            <div className="error-row">
              <span>Status</span>
              <strong>Runtime Exception</strong>
            </div>

            <div className="error-row">
              <span>Message</span>
              <strong>
                {error?.message || "Unexpected application error"}
              </strong>
            </div>

            <div className="error-row">
              <span>Timestamp</span>
              <strong>{new Date().toLocaleString()}</strong>
            </div>
          </div>

          {import.meta.env.DEV && error?.stack && (
            <details className="admin-stack">
              <summary>Developer Information</summary>
              <pre>{error.stack}</pre>
            </details>
          )}

          <div className="admin-error-actions">
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>

            <button
              className="btn btn-success"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
