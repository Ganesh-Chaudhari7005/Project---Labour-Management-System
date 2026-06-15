import { useEffect, useState, useContext } from "react";
import { ApiRoute } from "./ApiConfig";
import { motion } from "framer-motion";
import LoginContext from "../Context/LoginContext";
import {ToastContainer , toast} from "react-toastify";
export default function AttendanceReport() {
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7);
  let { loggedInUser } = useContext(LoginContext);
  let [isdownloading, setdownloading] = useState(false);
  const [labours, setLabours] = useState([]);
  const [selectedLabour, setSelectedLabour] = useState("");
  const [activeTab, setActiveTab] = useState("labour");
  const [month, setMonth] = useState(currentMonth);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [report, setReport] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLabourType, setSelectedLabType] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [supervisorList, setSupervisorList] = useState([]);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState("");

  const [supervisorMonth, setSupervisorMonth] = useState("");
  const [supervisorFromDate, setSupervisorFromDate] = useState("");
  const [supervisorToDate, setSupervisorToDate] = useState("");

  const [supervisorReportData, setSupervisorReportData] = useState([]);
  const [supervisorReportType, setSupervisorReportType] = useState("");

  useEffect(()=>{
   if(loggedInUser?.UserRole.toLowerCase() === "supervisor"){
     setSelectedSupervisorId(sessionStorage.getItem("SupId"));
   }
  },[])
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



  const getSupervisorReport = async (type) => {
    setLoading(true);
    console.log(selectedSupervisorId);

    try {
      const response = await fetch(`${ApiRoute}supervisor-attendance-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          supervisorId: selectedSupervisorId,
          month: supervisorMonth,
          fromDate: supervisorFromDate,
          toDate: supervisorToDate,
        }),
      });

      const data = await response.json();
      console.log(data);

      setSupervisorReportData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSupervisors = async () => {
    console.log("called");

    try {
      const response = await fetch(`${ApiRoute}supervisors-list`);

      const data = await response.json();

      setSupervisorList(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSupervisors();
  }, []);




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


  const downloadPdf = async () => {
    setdownloading(true);
    try {
      const response = await fetch(`${ApiRoute}download-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report,
          summary,
          labourName:
            labours.find((l) => l.ID.toString() === selectedLabour)?.Name ||
            "All Labour",
        }),
      });

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance-report.pdf";

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report Downloaded Successfully");
      setdownloading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to Download Report");
      setdownloading(false);
    }
  };

  const downloadSupervisorPdf = async () => {
    setdownloading(true);
    try {
      const response = await fetch(`${ApiRoute}download-supervisor-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report: supervisorReportData,
          supervisorName:
            supervisorList.find((s) => s.ID.toString() === selectedSupervisorId)
              ?.Name || "All Supervisors",
        }),
      });

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "supervisor-attendance-report.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
      setdownloading(false);
      toast.success("Report Downloaded Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to Download Report");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer />
      <div className="btn-group mb-3 p-3">
        <button
          style={{
            border: "none",
            padding: "0 0 8px 0",
            fontSize: "18px",
            fontWeight: "500",
            backgroundColor: "#fff",
            color: "#000",
            marginRight: "30px",
          }}
          className={`btn ${
            activeTab === "labour" ? "rp-acttab" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("labour")}
        >
          Labour Attendance Report
        </button>

        <button
          style={{
            border: "none",
            padding: "0 0 8px 0",
            fontSize: "18px",
            fontWeight: "500",
            backgroundColor: "#fff",
            color: "#000",
          }}
          className={`btn ${
            activeTab === "supervisor" ? "rp-acttab" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("supervisor")}
        >
          {loggedInUser?.UserRole.toLowerCase() === "supervisor"
            ? "Your Attendance Report"
            : "Supervisor Attendance Report"}
        </button>
      </div>

      {activeTab === "labour" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {
            <div className="card p-4 shadow">
              <h4 className="mb-3">Labour Attendance Report</h4>

              {/* Filters */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="mb-2 mb-md-0">Select Labour</label>
                  <select
                    className="form-select mb-2 mb-md-0"
                    value={selectedLabour}
                    onChange={(e) => {
                      const labour = labours.find(
                        (l) => l.ID.toString() === e.target.value,
                      );

                      setSelectedLabour(e.target.value);
                      setSelectedLabType(labour?.LabType || "");
                    }}
                  >
                    <option value="">Select</option>
                    {labours.map((l) => (
                      <option key={l.ID} value={l.ID} Labtype={l.LabType}>
                        {l.Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="mb-2 mb-md-0">Select Month</label>
                  <input
                    type="month"
                    className="form-control mb-2 mb-md-0"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label>From Date</label>
                  <input
                    type="date"
                    className="form-control mb-2 mb-md-0"
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
                        <strong>Total Balance: ₹{summary.balance}</strong>
                      </p>

                      {/* {selectedType === "current" && (
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
                      )} */}
                    </div>
                  )
                : null}

              {report.length > 0 && (
                <button className="btn btn-primary" onClick={downloadPdf}>
                  {isdownloading ? "Dowloading..." : "Download PDF"}
                </button>
              )}
            </div>
          }
        </motion.div>
      )}

      {activeTab === "supervisor" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {
            <>
              {loggedInUser?.UserRole?.toLowerCase() === "supervisor" && (
                <div className="card p-4 shadow">
                  <h4 className="mb-3">
                    {loggedInUser?.UserRole.toLowerCase() === "supervisor"
                      ? "Attendance Report"
                      : "Supervisor Attendance Report"}
                  </h4>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="mb-2 mb-md-0">Select Month</label>
                      <input
                        type="month"
                        className="form-control mb-2 mb-md-0"
                        value={supervisorMonth}
                        onChange={(e) => setSupervisorMonth(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="mb-2 mb-md-0">From Date</label>
                      <input
                        type="date"
                        className="form-control mb-2 mb-md-0"
                        value={supervisorFromDate}
                        onChange={(e) => setSupervisorFromDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-4">
                      <label>To Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={supervisorToDate}
                        onChange={(e) => setSupervisorToDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3 py-3 d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => getSupervisorReport("current")}
                    >
                      Current Month
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => getSupervisorReport("month")}
                    >
                      Selected Month
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={() => getSupervisorReport("range")}
                    >
                      Date Range
                    </button>
                    {supervisorReportData.length > 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={downloadSupervisorPdf}
                      >
                        {isdownloading ? "Downloading..." : "Download Report"}
                      </button>
                    )}
                  </div>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border"></div>
                    </div>
                  ) : supervisorReportData.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="tbl-head">Sr No</th>
                            <th className="tbl-head">Date</th>
                            <th className="tbl-head">Supervisor</th>
                            <th className="tbl-head">Status</th>
                            <th className="tbl-head">Working Site</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supervisorReportData
                            .sort((a, b) => new Date(a.date) - new Date(b.date)) // <-- sort ascending
                            .map((r, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td> {/* Sr No */}
                                <td>{formatDate(r.AttendanceDate)}</td>
                                <td>{r.Name}</td>
                                <td>{r.Status}</td>
                                <td>{r.Site || "—"}</td>
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
                </div>
              )}

              {loggedInUser.UserRole.toLowerCase() === "admin" && (
                <div className="card p-4 shadow">
                  <h4 className="mb-3">
                    {loggedInUser?.UserRole.toLowerCase() === "supervisor"
                      ? "Attendance Report"
                      : "Supervisor Attendance Report"}
                  </h4>

                  <div className="row mb-3">
                    <div className="col-md-3">
                      <label className="mb-2 mb-md-0">Select Supervisor</label>

                      <select
                        className="form-select mb-2 mb-md-0"
                        value={selectedSupervisorId}
                        onChange={(e) =>
                          setSelectedSupervisorId(e.target.value)
                        }
                      >
                        <option value="">All Supervisors</option>

                        {supervisorList.map((supervisor) => (
                          <option key={supervisor.ID} value={supervisor.ID}>
                            {supervisor.Name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="mb-2 mb-md-0">Select Month</label>
                      <input
                        type="month"
                        className="form-control mb-2 mb-md-0"
                        value={supervisorMonth}
                        onChange={(e) => setSupervisorMonth(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="mb-2 mb-md-0">From Date</label>
                      <input
                        type="date"
                        className="form-control mb-2 mb-md-0"
                        value={supervisorFromDate}
                        onChange={(e) => setSupervisorFromDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-3">
                      <label>To Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={supervisorToDate}
                        onChange={(e) => setSupervisorToDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mb-3 py-3 d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => getSupervisorReport("current")}
                    >
                      Current Month
                    </button>

                    <button
                      className="btn btn-secondary"
                      onClick={() => getSupervisorReport("month")}
                    >
                      Selected Month
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={() => getSupervisorReport("range")}
                    >
                      Date Range
                    </button>
                    {supervisorReportData.length > 0 && (
                      <button
                        className="btn btn-primary"
                        onClick={downloadSupervisorPdf}
                      >
                        {isdownloading ? "Downloading..." : "Download Report"}
                      </button>
                    )}
                  </div>
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border"></div>
                    </div>
                  ) : supervisorReportData.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="tbl-head">Sr No</th>
                            <th className="tbl-head">Date</th>
                            <th className="tbl-head">Supervisor</th>
                            <th className="tbl-head">Status</th>
                            <th className="tbl-head">Working Site</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supervisorReportData
                            .sort((a, b) => new Date(a.date) - new Date(b.date)) // <-- sort ascending
                            .map((r, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td> {/* Sr No */}
                                <td>{formatDate(r.AttendanceDate)}</td>
                                <td>{r.Name}</td>
                                <td>{r.Status}</td>
                                <td>{r.Site || "—"}</td>
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
                </div>
              )}
            </>
          }
        </motion.div>
      )}
    </motion.div>
  );
}
