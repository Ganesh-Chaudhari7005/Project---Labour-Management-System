  import { useEffect, useState } from "react";
  import { ApiRoute } from "./ApiConfig";
  import { toast, ToastContainer } from "react-toastify";
  import { motion } from "framer-motion";
  export default function WageManagement() {
  const [wagesData, setWagesData] = useState([]);
  const [search, setSearch] = useState("");
  const [labourType, setLabourType] = useState("");
  const FetchWages = async () => {
    try {
      const response = await fetch(`${ApiRoute}getLabourWages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setWagesData(data.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch wages");
    }
  };

  useEffect(() => {
    FetchWages();
  }, []);

  const UpdateWages = async (labourID, wages) => {
    try {
      const response = await fetch(`${ApiRoute}updateLabourWages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          labourID,
          wages,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        FetchWages();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update wages");
    }
  };

  const filteredData = wagesData.filter((item) => {
    const matchesSearch = item.Name.toLowerCase().includes(search.toLowerCase());

    const matchesType = labourType === "" || item.LabType === labourType;

    return matchesSearch && matchesType;
  });

  const totalDailyWages = wagesData.reduce(
    (total, item) => total + Number(item.wages || 0),
    0,
  );

  const totalHelpers = wagesData
    .filter((item) => item.LabType === "Helper")
    .reduce((total, item) => total + Number(item.wages || 0), 0);

  const totalMisteri = wagesData
    .filter((item) => item.LabType === "Misteri")
    .reduce((total, item) => total + Number(item.wages || 0), 0);
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-2">
          <ToastContainer />
          <div className="equip-header-card">
            <div className="equip-header-left">
              <div className="equip-badge">
                <i className="ri-tools-line"></i>
                Wages Overview
              </div>

              <h1>Wages Management</h1>

              <p>Manage Labour wages effeciently</p>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <motion.div
                className="equip-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>Total Daily Wages</span>

                <h2>₹ {totalDailyWages}</h2>
              </motion.div>

              <motion.div
                className="equip-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span>Total Helper Wages</span>

                <h2>₹ {totalHelpers}</h2>
              </motion.div>

              <motion.div
                className="equip-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{fontWeight : 600, fontSize : "2rem"}}
              >
                <span>Total Misteri Wages</span>

                <h2>₹ {totalMisteri}</h2>
              </motion.div>
            </div>

            {/* Decorative Circles */}
            <div className="equip-bg-circle one"></div>
            <div className="equip-bg-circle two"></div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                placeholder="Search by Labour Name"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={labourType}
                onChange={(e) => setLabourType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Misteri">Misteri</option>
                <option value="Helper">Helper</option>
              </select>
            </div>
          </div>
          {/* TABLE */}
          <div className="table-responsive py-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="tbl-head">Labour Name</th>
                  <th className="tbl-head">Labour Type</th>
                  <th className="tbl-head">Daily Wage (₹)</th>
                  <th className="tbl-head">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Name}</td>

                      <td>{item.LabType}</td>

                      <td>
                        <input
                          type="number"
                          defaultValue={item.wages}
                          className="form-control"
                        />
                      </td>

                      <td>
                        <button
                          className="pendingBillsViewBtn"
                          onClick={(e) => {
                            const value =
                              e.target.parentElement.parentElement.querySelector(
                                "input",
                              ).value;

                            UpdateWages(item.ID, value);
                          }}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">
                      <motion.div
                        className="pjx-empty"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="pjx-empty-icon"
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                          }}
                        >
                          🔍
                        </motion.div>

                        <h4>No Results Found</h4>

                        <p>Try changing filters or search keyword</p>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  }
