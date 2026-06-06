import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig";
import { motion } from "framer-motion";
export default function AttendanceReport() {
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);

  const [labours, setLabours] = useState([]);
const [selectedLabour, setSelectedLabour] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLabourType, setSelectedLabType] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // 🔹 Fetch labours
  useEffect(() => {
    fetch(`${ApiRoute}fetch-labours`)
      .then((res) => res.json())
      .then((data) => setLabours(data));
  }, []);

  useEffect(() => {
    console.log("labour is", selectedLabour);
  }, [selectedLabour]);

  useEffect(() => {
    if (labours.length && selectedLabour) {
      const labour = labours.find(
        (l) => l.ID.toString() === selectedLabour.toString(),
      );

      setSelectedLabType(labour?.LabType || "");
    }
  }, [labours, selectedLabour]);
  useEffect(() => {
    console.log("labours are", labours);
  }, [labours]);
  // 🔹 Fetch report
  const getReport = async (type) => {
    setLoading(true);

    try {
      const res = await fetch(`${ApiRoute}get-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          labour: selectedLabour,
          type,
          month,
          fromDate,
          toDate,
          LabourType: selectedLabourType,
        }),
      });

      const data = await res.json();
      console.log(data);

      setReport(data.records || []);
      setSummary(data.summary || null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (selectedLabour && selectedLabourType) {
      getReport("current");
      setSelectedType("current");
    }
  }, [selectedLabour, selectedLabourType]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mt-4">
        <div className="card p-4 shadow">
          <h4 className="mb-3">Attendance Report</h4>

          {/* Filters */}
          <div className="row mb-3">
            <div className="col-md-3">
              <label>Select Labour</label>
              <select
                className="form-select"
                value={selectedLabour}
                onChange={(e) => {
                  const labour = labours.find(
                    (l) => l.ID.toString() === e.target.value,
                  );

                  setSelectedLabour(e.target.value);
                  setSelectedLabType(labour?.LabType || "");
                }}
              >
                <option value="">All</option>
                {labours.map((l) => (
                  <option key={l.ID} value={l.ID} Labtype={l.LabType}>
                    {l.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label>Select Month</label>
              <input
                type="month"
                className="form-control"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label>From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label>To Date</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-3 py-3 d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                getReport("current");
                setSelectedType("current");
              }}
            >
              Current Month
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => getReport("month")}
            >
              Selected Month
            </button>

            <button
              className="btn btn-success"
              onClick={() => getReport("range")}
            >
              Date Range
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border"></div>
            </div>
          ) : report.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="tbl-head">Sr No</th>
                    <th className="tbl-head">Date</th>
                    <th className="tbl-head">Labour</th>
                    <th className="tbl-head">Site</th>
                    <th className="tbl-head">Status</th>
                    {selectedLabourType.toLowerCase() !== "helper" && (
                      <th className="tbl-head">WorkType</th>
                    )}
                    <th className="tbl-head">Work Done</th>
                    <th className="tbl-head">Advance</th>
                    <th className="tbl-head">Day Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report
                    .sort((a, b) => new Date(a.date) - new Date(b.date)) // <-- sort ascending
                    .map((r, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td> {/* Sr No */}
                        <td>{formatDate(r.date)}</td>
                        <td>{r.Name}</td>
                        <td>{r.ProjectName || "—"}</td>
                        <td>{r.status}</td>
                        {selectedLabourType.toLowerCase() !== "helper" && (
                          <td>{r.WorkName || "—"}</td>
                        )}
                        <td>
                          {r.Work_Done || r.WorkDoneHelper}{" "}
                          {selectedLabourType.toLowerCase() !== "helper"
                            ? "Sq. Ft."
                            : ""}
                        </td>
                        <td>{r.advance}</td>
                        <td>{r.Day_Total}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-calendar-x fs-1 text-muted"></i>
              <h5 className="mt-3">No Attendance Records Found</h5>
              <p className="text-muted mb-0">
                No attendance data is available for the selected period.
              </p>
            </div>
          )}

          {/* Table */}

          {report.length > 0
            ? summary && (
                <div className="mt-4 p-3 bg-light rounded">
                  <h5>Summary</h5>
                  <p>Total Days: {summary.days}</p>
                  <p>Total Wages: ₹{summary.total}</p>
                  <p>Total Money taken : ₹{summary.advance}</p>

                  <p>
                    <strong>This Month Balance: ₹{summary.balance}</strong>
                  </p>

                  {selectedType === "current" && (
                    <p>
                      Past Month : {summary.pastFlag === "Add" ? "+" : "-"}
                      {summary.previousBalance}
                    </p>
                  )}
                  {selectedType === "current" && (
                    <p>
                      <strong>
                        Total Balance :{" "}
                        {summary.pastFlag === "Add"
                          ? summary.balance + summary.previousBalance
                          : ""}
                      </strong>
                    </p>
                  )}
                </div>
              )
            : null}
        </div>
      </div>
    </motion.div>
  );
}
