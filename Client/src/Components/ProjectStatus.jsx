import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiRoute } from "./ApiConfig";
import { motion } from "framer-motion";
import styles from "./projectstatus.module.css";
import { useApi } from "./ApiCaller";

export default function ProjectStatus() {
  const { id } = useParams();
  const callApi = useApi();

  const [workDetails, setWorkDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [ProjectName, setProjectName] = useState();
  const getProjectDetails = async () => {
    const reqPrj = await callApi(`${ApiRoute}getProject-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setProjectName(reqPrj.projectdetails.ProjectName);
  };

  const fetchStatus = async () => {
    const reqStatus = await fetch(`${ApiRoute}get-project-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const res = await reqStatus.json();
    setWorkDetails(res);
  };

  useEffect(() => {
    getProjectDetails();
    fetchStatus();
  }, []);

  const highlightText = (text) => {
    if (!search) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className={styles.highlight}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const filteredWork = workDetails.filter((item) => {
    const nameMatch = item.WorkName?.toLowerCase().includes(
      search.toLowerCase(),
    );

    const percentage = item.TotalArea
      ? Math.round((item.CompletedArea / item.TotalArea) * 100)
      : 0;

    let statusMatch = true;

    if (filter === "COMPLETED") statusMatch = percentage === 100;
    if (filter === "IN_PROGRESS")
      statusMatch = percentage > 0 && percentage < 100;
    if (filter === "NOT_STARTED") statusMatch = percentage === 0;

    return nameMatch && statusMatch;
  });

  const totalArea = filteredWork.reduce(
    (sum, item) => sum + Number(item.TotalArea || 0),
    0,
  );

  const totalCompleted = filteredWork.reduce(
    (sum, item) => sum + Number(item.CompletedArea || 0),
    0,
  );

  const overallPercentage = totalArea
    ? Math.round((totalCompleted / totalArea) * 100)
    : 0;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
    <div className="prjname-cont">
      {/* <h3 className="prj-st-res-st">{ProjectName}</h3> */}
    </div>
      <div className={styles.header}>
        <h2>Site Status</h2>

        <div className={styles.rightHeader}>
          <input
            type="text"
            placeholder="Search work..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filter}
          >
            <option value="ALL">All</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="NOT_STARTED">Not Started</option>
          </select>

          <div className={styles.overallBox}>
            <span>Overall</span>
            <strong>{overallPercentage}%</strong>
          </div>
        </div>
      </div>

      <div className={styles.overallBar}>
        <div
          className={styles.overallFill}
          style={{ width: `${overallPercentage}%` }}
        ></div>
      </div>

      {filteredWork.length === 0 && (
        <div className={styles.empty}>No matching work found</div>
      )}

      <div className={styles.grid}>
        {filteredWork.map((data, index) => {
          const percentage = data.TotalArea
            ? Math.round((data.CompletedArea / data.TotalArea) * 100)
            : 0;

          return (
            <motion.div
              key={index}
              className={styles.card}
              whileHover={{ scale: 1.03 }}
            >
              <div className={styles.cardTop}>
                <h4>{highlightText(data.WorkName)}</h4>
                <span className={styles.percent}>{percentage}%</span>
              </div>

              <div className={styles.info}>
                <span>Total: {data.TotalArea} sq.ft</span>
                <span>Done: {data.CompletedArea} sq.ft</span>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
