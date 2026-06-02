import { motion } from "framer-motion";

export default function SupervisorDashboard() {
  const stats = [
    { title: "Projects", count: 24, color: "#4f46e5" },
    { title: "Users", count: 120, color: "#16a34a" },
    { title: "Labours", count: 58, color: "#f59e0b" },
    { title: "Equipment", count: 33, color: "#ef4444" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-4"
    >
      <div className="row g-4">
        {stats.map((item, i) => (
          <div className="col-12 col-sm-6 col-lg-3" key={i}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="dash-card"
              style={{ borderTop: `4px solid ${item.color}` }}
            >
              <div className="dash-title">{item.title}</div>
              <div className="dash-count">{item.count}</div>
              <div className="dash-sub">Total {item.title.toLowerCase()}</div>
              <p>supervisor</p>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
