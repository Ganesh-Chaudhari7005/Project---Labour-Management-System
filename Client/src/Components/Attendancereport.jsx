import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig";

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

  // 🔹 Fetch labours
  useEffect(() => {
    fetch(`${ApiRoute}fetch-labours`)
      .then((res) => res.json())
      .then((data) => setLabours(data));
  }, []);

  // 🔹 Fetch report
  const getReport = async (type) => {
    let body = {
      labour: selectedLabour,
      type,
      month,
      fromDate,
      toDate,
    };

    const res = await fetch(`${ApiRoute}get-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setReport(data.records || []);
    setSummary(data.summary || null);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
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
              onChange={(e) => setSelectedLabour(e.target.value)}
            >
              <option value="">All</option>
              {labours.map((l) => (
                <option key={l.ID} value={l.ID}>
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
        <div className="mb-3 d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => getReport("current")}
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

        {/* Table */}
        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Date</th>
                <th>Labour</th>
                <th>Status</th>
                <th>Work Done</th>
                <th>Advance</th>
                <th>Day Total</th>
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
                    <td>{r.status}</td>
                    <td>{r.Work_Done}</td>
                    <td>{r.advance}</td>
                    <td>{r.Day_Total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* Summary */}
        {summary && (
          <div className="mt-4 p-3 bg-light rounded">
            <h5>Summary</h5>
            <p>Total Days: {summary.days}</p>
            <p>Total Wage: ₹{summary.total}</p>
            <p>Total Advance: ₹{summary.advance}</p>
            <p>
              <strong>Balance: ₹{summary.balance}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
