import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig.js";

export default function RecordAttendance() {
  const todayDate = new Date().toISOString().split("T")[0];

  const [labour, setLabour] = useState("");
  const [status, setStatus] = useState("");
  const [advance, setAdvance] = useState("");
  const [mode, setMode] = useState("");
  const [date, setDate] = useState(todayDate);

  const [AlllabourList, setLabourList] = useState([]);

  const getLaboursList = async () => {
    const reqLabourList = await fetch(`${ApiRoute}fetch-labours`);
    const res = await reqLabourList.json();
    setLabourList(res);
  };

  useEffect(() => {
    getLaboursList();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      labour,
      status,
      advance,
      mode,
      date,
    };

    console.log(data);
    alert("Attendance Saved!");
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h4 className="mb-4">Record Attendance</h4>

        <form onSubmit={handleSubmit}>
          {/* DATE */}
          <div className="mb-4">
            <label className="form-label">Select Date</label>

            <div className="d-flex align-items-center gap-3">
              <button
                type="button"
                className={`btn ${
                  date === todayDate ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setDate(todayDate)}
              >
                Today
              </button>

              <span className="fw-semibold text-muted">OR</span>

              <input
                type="date"
                className="form-control"
                style={{ maxWidth: "200px" }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <small className="text-muted">Selected: {date}</small>
            </div>
          </div>

          <div className="row">
            {/* LABOUR */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Select Labour</label>
              <select
                className="form-select"
                value={labour}
                onChange={(e) => setLabour(e.target.value)}
                required
              >
                <option value="">-- Select Labour --</option>
                {AlllabourList.map((data) => (
                  <option key={data.ID} value={data.ID}>
                    {data.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="P">Present (P)</option>
                <option value="A">Absent (A)</option>
                <option value="PP">Half Day (PP)</option>
                <option value="PH">Paid Holiday (PH)</option>
              </select>
            </div>
          </div>

          <div className="row">
            {/* ADVANCE */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Advance (₹)</label>
              <input
                type="number"
                className="form-control"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
                disabled={status === "A"}
              />
            </div>

            {/* MODE */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Payment Mode</label>
              <select
                className="form-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                disabled={!advance}
              >
                <option value="">-- Select Mode --</option>
                <option value="cash">Cash</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>

          <div className="text-end">
            <button className="btn btn-primary px-4" type="submit">
              Save Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
