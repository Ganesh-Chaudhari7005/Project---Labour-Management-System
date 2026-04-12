import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig.js";
import {toast, ToastContainer} from "react-toastify"
export default function RecordAttendance() {
  const todayDate = new Date().toISOString().split("T")[0];

  const [labour, setLabour] = useState("");
  const [status, setStatus] = useState("");
  const [advance, setAdvance] = useState(0);
  const [mode, setMode] = useState("");
  const [date, setDate] = useState(todayDate);
  const [workDone, setworkdone] = useState("");
  const [AlllabourList, setLabourList] = useState([]);

  const getLaboursList = async () => {
    const reqLabourList = await fetch(`${ApiRoute}fetch-labours`);
    const res = await reqLabourList.json();
    setLabourList(res);
  };

  useEffect(() => {
    getLaboursList();
  }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();

   const data = {
     labour,
     status,
     advance,
     mode,
     date,
     workDone,
   };

   try {
     const res = await fetch(`${ApiRoute}add-attendance`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(data),
     });

     const result = await res.json();

     if (result.success) {
       toast.success("Attendance Saved!");
     } else {
       toast.error("❌ " + result.message);
            }
   } catch (err) {
     console.error(err);
     alert("Server error");
   }
 };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <div className="p-4">
        <h4 className="mb-4">Record Attendance</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Select Date</label>

            <div className="row">
              <div className="col-md-6">
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
              <div className="col-md-6">
                <div>
                  <label className="form-label">
                    Total Work Done (Sq. Ft./ R. Ft.)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={workDone}
                    onChange={(e) => setworkdone(e.target.value)}
                    disabled={status === "A"}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Select Labour</label>
              <select
                className="form-select mb-3"
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
                <option value="H">Half Day (H)</option>
                <option value="PH">Present 1.5 Hajari(PH)</option>
                <option value="PP">Present 2 Hajari (PP)</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Advance (₹)</label>
              <input
                type="number"
                className="form-control mb-3"
                value={advance}
                onChange={(e) => setAdvance(e.target.value)}
              />

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

          <div className="text-end py-3">
            <button className="btn btn-primary px-4" type="submit">
              Save Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
