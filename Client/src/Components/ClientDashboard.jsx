import { motion } from "framer-motion";
import { ApiRoute } from "./ApiConfig.js";
import { useEffect, useState } from "react";
import CountUp from "./CountUp.jsx";
import { BASE_URL } from "./BaseUrl";

export default function ClientDashboard() {
  const ID = sessionStorage.getItem("ClientID");
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const [TotalProjectsCount, setTotalProjectCount] = useState(0);
  const [CompletedProjectCount, SetCompletedProjectCount] = useState(0);
  const [PendingProjectCount, SetPendingProjectCount] = useState(0);
  const [TotalLaboursCount, SetTotalLaboursCount] = useState(0);
  const [TotalMisteriCount, SetTotalMisteriCount] = useState(0);
  const [TotalHelperCount, SetTotalHelperCount] = useState(0);
  const [TotalUsersCount, SetTotalUsersCount] = useState(0);
  const [TotalAdminCount, SetTotalAdminCount] = useState(0);
  const [TotalClientsCount, SetTotalClientsCount] = useState(0);
  const [TotalSupUsersCount, SetTotalSupUsersCount] = useState(0);
  const [TotalLabCount, SetTotalLabCount] = useState(0);
  const [TotalSupCount, SetTotalSupCount] = useState(0);
  const [last30DaysPayment, setLast30DaysPayment] = useState(0);
  const [TotalServiceRequests, setTotalServiceRequests] = useState(0);
  const [TotalIssues, setTotalIssues] = useState(0);
  const [monthlyPayments, setMonthlyPayments] = useState([]);
const[billscount, setbillscount] = useState([]);
const[totalmothpayment, settotalmonthpayment] = useState(0);
const [projects, setProjects] = useState([]);
const [newBills, setNewBills] = useState([]);
  const getClientProjects = async (clientId) => {
    const req = await fetch(`${ApiRoute}get-client-project-progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ID }),
    });
    
    const res = await req.json();
     console.log(res);

    setProjects(res);
  };

  const getNewBills = async () => {
  const req = await fetch(`${ApiRoute}get-new-bills`);
  const res = await req.json();

  setNewBills(res);
};

  const getProjectCounts = async () => {
    let req = await fetch(`${ApiRoute}get-client-project-count/${ID}`);
    let res = await req.json();
    console.log(res);

    setTotalProjectCount(res.TotalProjectCount);
    SetCompletedProjectCount(res.CompletedCount);
    SetPendingProjectCount(res.PendingCount);
  };

  const getUsersCounts = async () => {
    let req = await fetch(`${ApiRoute}get-Users-count`);
    let res = await req.json();
    console.log(res);

    SetTotalUsersCount(res.TotalUsersCount);
    SetTotalAdminCount(res.AdminCount);
    SetTotalClientsCount(res.ClientUserCount);
    SetTotalSupUsersCount(res.SupUserCount);
    SetTotalLabCount(res.LabUserCount);
  };

  const getLaboursCounts = async () => {
    let req = await fetch(`${ApiRoute}get-labours-count`);
    let res = await req.json();
    console.log(res);

    SetTotalLaboursCount(res.TotalLabourCount);
    SetTotalMisteriCount(res.MisteriCount);
    SetTotalHelperCount(res.HelperCount);
  };

  const getSupCounts = async () => {
    let req = await fetch(`${ApiRoute}get-sup-count`);
    let res = await req.json();
    console.log(res);

    SetTotalSupCount(res.TotalSupCount);
    //  SetTotalMisteriCount(res.MisteriCount);
    //  SetTotalHelperCount(res.HelperCount);
  };

  const getLast30DaysPayment = async () => {
    const req = await fetch(`${ApiRoute}get-last-30-days-payment`);
    const res = await req.json();

    setLast30DaysPayment(res.TotalReceivedLast30Days);
  };

  const getServiceRequestCount = async () => {
    let req = await fetch(`${ApiRoute}get-service-request-count`);
    let res = await req.json();

    setTotalServiceRequests(res.TotalRequests);
  };

  const getIssueCount = async () => {
    let req = await fetch(`${ApiRoute}get-issue-count`);
    let res = await req.json();

    setTotalIssues(res.TotalIssues);
  };

  const getMonthlyPayments = async () => {
    let req = await fetch(`${ApiRoute}get-monthly-payments`);
    let res = await req.json();

    setMonthlyPayments(res);
  };

  const getBilling = async () => {
    const req = await fetch(`${ApiRoute}client-billing-summary/${ID}`);
    const res = await req.json();

    setbillscount(res.countDetails);
    settotalmonthpayment(res.totalPaymentmonth.TotalPaidLast30Days);
    console.log(res);
    
  };
  useEffect(() => {
    getProjectCounts();
    getLaboursCounts();
    getUsersCounts();
    getSupCounts();
    getLast30DaysPayment();
    getServiceRequestCount();
    getIssueCount();
    getMonthlyPayments();
    getBilling();
    getClientProjects();
    getNewBills();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-4"
    >
      <div className="row g-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="dash-card"
            style={{ borderTop: `4px solid #4f46e5` }}
          >
            <div className="dash-title">Total Projects</div>
            <div className="dash-count">
              {" "}
              <CountUp end={TotalProjectsCount} />
            </div>
            <div className="dash-sub">
              Total Completed : <CountUp end={CompletedProjectCount} />
            </div>
            <div className="dash-sub">
              Total Pending : <CountUp end={PendingProjectCount} />
            </div>
          </motion.div>
        </div>
        <div className="col-12 col-sm-6 col-lg-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="dash-card"
            style={{
              paddingBottom: "40px",
              borderTop: "4px solid #22c55e",
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(255,255,255,1))",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="dash-title">Payment (Last 30 Days)</div>
                <div
                  className="dash-count"
                  style={{
                    color: "#16a34a",
                    fontSize: "2.2rem",
                    fontWeight: "700",
                  }}
                >
                  ₹<CountUp end={Number(totalmothpayment)} />
                </div>
                <div className="dash-sub">
                  Total payments done in the last 30 days
                </div>
              </div>

              <div
                style={{
                  fontSize: "4rem",
                  opacity: 0.15,
                }}
              >
                🧾
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="dash-card"
            style={{ borderTop: `4px solid #ef4444` }}
          >
            <div className="dash-title">Total Bills</div>
            <div className="dash-count mb-4">
              <CountUp end={billscount.TotalBills} />
            </div>
            <div className="row m-0">
              <div className="col-md-6 p-0">
                <div className="dash-sub">
                  Paid Bills : {billscount.PaidBills}
                </div>
              </div>
              <div className="col-md-6 p-0">
                <div className="dash-sub">
                  UnPaid Bills : {billscount.PendingBills}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="row pt-4">
          <div className="col-lg-8">
            <div className="row g-3">
              {projects.map((p) => (
                <div className="col-md-12" key={p.ProjectID}>
                  <motion.div
                    className="dash-card p-4"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      borderTop: "4px solid #4f46e5",
                      background: "linear-gradient(135deg, #eef2ff, #fff)",
                    }}
                  >
                    <div className="dash-title">{p.ProjectName}</div>

                    <div className="d-flex justify-content-between mt-2">
                      <small>Work Progress</small>
                      <small>{p.OverallPercentage}%</small>
                    </div>

                    <div className="progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${p.OverallPercentage}%` }}
                      />
                    </div>

                    <div className="dash-sub mt-3">
                      {p.OverallPercentage === 100
                        ? "🎉 Completed"
                        : "🏗 In Progress"}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="dash-card"
              style={{
                borderTop: "4px solid #ef4444",
                background:
                  "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(255,255,255,1))",
                position: "relative",
                overflow: "hidden",
                paddingBottom: "5px",
              }}
            >
              {/* flashing alert dot */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ef4444",
                  boxShadow: "0 0 10px #ef4444",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div className="d-flex align-items-center">
                <div style={{ fontSize: "1.8rem", opacity: 0.25 }}>⚠️</div>
                <div className="dash-title" style={{ color: "#dc2626" }}>
                  Reported Issues
                </div>
              </div>

              <div
                className="dash-count"
                style={{ color: "#b91c1c", fontWeight: "800" }}
              >
                <CountUp end={TotalIssues} />
              </div>

              <div className="dash-sub">Needs attention from admin</div>
            </motion.div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="col-12 mt-4">
              <motion.div
                className="dash-card"
                style={{
                  borderTop: "4px solid #f59e0b",
                  background: "linear-gradient(135deg, #fff7ed, #fff)",
                }}
              >
                <div className="dash-title">🧾 New Bills Generated</div>

                {newBills.length === 0 ? (
                  <p className="text-muted mt-2">No new bills today</p>
                ) : (
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {newBills.map((bill) => (
                      <div
                        key={bill.BillID}
                        className="p-2 border-bottom d-flex justify-content-between"
                      >
                        <div>
                          <div className="fw-bold">Bill #{bill.BillNo}</div>

                          <small className="text-muted">
                            Project: {bill.ProjectID}
                          </small>
                        </div>

                        <div className="text-end">
                          <div style={{ color: "#16a34a", fontWeight: "600" }}>
                            ₹{bill.TotalAmount}
                          </div>

                          <small className="text-muted">
                            {new Date(bill.billdate).toLocaleString()}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="col-12">
              <motion.div
                className="dash-card p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="dash-title mb-3">
                  💰 Payments Received (This Month)
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Sr. No.</th>
                        <th>Project</th>
                        <th>Amount</th>
                        <th>Payment Date</th>
                        <th>Receipt</th>
                      </tr>
                    </thead>

                    <tbody>
                      {monthlyPayments.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center text-muted">
                            No payments this month
                          </td>
                        </tr>
                      ) : (
                        monthlyPayments.map((bill, index) => (
                          <tr key={bill.BillID}>
                            <td>{index + 1}</td>

                            <td>
                              <span className="badge bg-primary">
                                {bill.ProjectID}
                              </span>
                            </td>

                            <td>
                              <strong style={{ color: "#16a34a" }}>
                                ₹{bill.TotalAmount}
                              </strong>
                            </td>

                            <td>
                              {new Date(
                                bill.BillPaymentDate,
                              ).toLocaleDateString()}
                            </td>

                            <td>
                              <button
                                className="btn btn-sm btn-outline-success"
                                onClick={() => {
                                  setShowPDF(true);
                                  setPdfUrl(
                                    `${BASE_URL}${bill.PaidBillReceipt}#toolbar=0`,
                                  );
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {showPDF && (
        <div className="pdf-popup-overlay">
          <div className="pdf-popup-container">
            <div className="pdf-popup-header">
              <h4>Invoice Preview</h4>

              <button
                className="pdf-close-btn"
                onClick={() => {
                  setShowPDF(false);
                  setPdfUrl("");
                }}
              >
                ✕
              </button>
            </div>

            <iframe
              src={pdfUrl}
              title="Invoice PDF"
              className="pdf-frame"
            ></iframe>
          </div>
        </div>
      )}
    </motion.div>
  );
}
