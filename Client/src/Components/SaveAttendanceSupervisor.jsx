import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig.js";
import { toast, ToastContainer } from "react-toastify";
export default function SaveAttendanceSupervisor() {
  const [isSuphasPrj, setSuphasPrj] = useState(true);
  const[workList, setWorkList] = useState([]);
  const todayDate = new Date().toISOString().split("T")[0];
  const [supAssignedPrjID, setSupAssignedPrjID] = useState("");
  const [isLabourSelected , setIsLabourSelected] = useState(true);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [status, setStatus] = useState("");
  const [advance, setAdvance] = useState(0);
  const [mode, setMode] = useState("");
  const [date, setDate] = useState(todayDate);
  const [workDone, setworkdone] = useState("");
  const [AlllabourList, setLabourList] = useState([]);

  const getSiteLabours = async () => {
    let user = sessionStorage.getItem("user");
    const userObj = JSON.parse(user);

    let email = userObj.UserEmail;

    let supervisorID = await fetch(`${ApiRoute}getsupID/${email}`);
    const ID = await supervisorID.json();
    const reqLabourList = await fetch(`${ApiRoute}check-sup-assign/${ID}`);
    const res = await reqLabourList.json();

    if (res.success) {
      setLabourList(res.Data);
      setSuphasPrj(false);
      const ProjectID = res.Data[0].ProjectID;
      setSupAssignedPrjID(res.Data[0].ProjectID);

      const getSupAllocatedPrjLabList = await fetch(
        `${ApiRoute}supAlcPrjList/${ProjectID}`,
      );

      const responce = await getSupAllocatedPrjLabList.json();

      setLabourList(responce.FetchedRows);
    } else {
      setSuphasPrj(true);
      console.log("Failed");
    }
  };

  const getWorkDetails = async()=>{    
    console.log("id is...",supAssignedPrjID);
    
    const Fetchdetails = await fetch(`${ApiRoute}get-assigned-prj-WorkDetails/${supAssignedPrjID}`);
    const WorkList = await Fetchdetails.json();
    console.log(WorkList);
    
  }
 useEffect(() => {
   getSiteLabours();
 }, []);

 useEffect(() => {
   if (supAssignedPrjID) {
     getWorkDetails();
   }
 }, [supAssignedPrjID]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      labour: selectedLabour?.LabourID,
      project_id: selectedLabour?.ProjectID,
      status,
      advance,
      mode,
      date,
      workDone,
      LabourType : selectedLabour?.LabType
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
        toast.error(result.message);
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
          <fieldset disabled={isSuphasPrj}>
            <div className="mb-4">
              <label className="form-label">Select Date</label>

              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-3">
                    <button
                      type="button"
                      className={`btn ${
                        date === todayDate
                          ? "btn-primary"
                          : "btn-outline-primary"
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
                    {selectedLabour?.LabType?.toLowerCase() === "misteri" ? (
                      <>
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
                      </>
                    ) : (
                      <>
                        <label className="form-label">Work Done</label>
                        <input
                          type="text"
                          className="form-control"
                          value={workDone}
                          onChange={(e) => setworkdone(e.target.value)}
                          disabled={isLabourSelected||status === "A"}
                          
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Select Labour</label>
                <select
                  className="form-select mb-3"
                  value={selectedLabour?.LabourID || ""}
                  onChange={(e) => {
                    const selected = AlllabourList.find(
                      (l) => l.LabourID === e.target.value,
                    );

                    setSelectedLabour(selected);
                    setIsLabourSelected(false);
                  }}
                  required
                >
                  <option value="">-- Select Labour --</option>

                  {AlllabourList.map((data) => (
                    <option key={data.LabourID} value={data.LabourID}>
                      {data.Name} ({data.LabType})
                    </option>
                  ))}
                </select>

                {selectedLabour?.ProjectName && (
                  <div className="project-info-box">
                    <strong>Currently Working on Site : </strong>{" "}
                    {selectedLabour.ProjectName}
                  </div>
                )}

                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  disabled={isLabourSelected}
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
                  disabled={isLabourSelected}
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
          </fieldset>
        </form>
      </div>
    </div>
  );
}
