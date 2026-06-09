import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig.js";
import { toast, ToastContainer } from "react-toastify";
export default function RecordAttendance() {
  const [workList, setWorkList] = useState([]);
  const [assignedProjects, setAssignedProjects] = useState([]);
  const todayDate = new Date().toISOString().split("T")[0];
  const [isLabourSelected, setIsLabourSelected] = useState(true);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const [selectedWorkID, setSelectedWorkID] = useState("");
  const [status, setStatus] = useState("");
  const [advance, setAdvance] = useState(0);
  const [mode, setMode] = useState("");
  const [date, setDate] = useState(todayDate);
  const [workDone, setworkdone] = useState("");
  const [AlllabourList, setLabourList] = useState([]);
  const [selectedProjectID, setSelectedProjectID] = useState("");
  const [supervisors, setSupervisors] = useState([]);

  const [formData, setFormData] = useState({
    SupervisorID: "",
    AttendanceDate: new Date().toISOString().split("T")[0],
    Status: "P",
    Site: "",
  });

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const res = await fetch(`${ApiRoute}supervisors`);

      const data = await res.json();

      console.log(data);

      setSupervisors(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveAttendance = async (e) => {

    e.preventDefault();

    if(!formData.SupervisorID){
      toast.error("Supervisor not Selected");
      return;
    }
    console.log(formData);
    

    try {
      const res = await fetch(`${ApiRoute}supervisor/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setFormData({
          SupervisorID: "",
          AttendanceDate: new Date().toISOString().split("T")[0],
          Status: "P",
          Site: "",
        });
      }
    } catch (err) {
      toast.eror(data.message);

      console.log(err);
    }
  };

  const getLaboursList = async () => {
    const reqLabourList = await fetch(`${ApiRoute}fetch-labours`);
    const res = await reqLabourList.json();
    console.log(res);

    setLabourList(res);
  };

  const getWorkDetails = async () => {
    const Fetchdetails = await fetch(
      `${ApiRoute}get-assigned-prj-WorkDetails/${selectedProjectID}`,
    );
    const WorkListObj = await Fetchdetails.json();
    console.log(WorkListObj);
    const fetchedWorkList = WorkListObj.WorkList;
    setWorkList(fetchedWorkList);
  };

  const handleSupervisorChange = async (e) => {
    const supervisorID = e.target.value;

    setFormData({
      ...formData,
      SupervisorID: supervisorID,
    });

    try {
      const res = await fetch(
        `${ApiRoute}supervisor/assigned-projects/${supervisorID}`,
      );

      const data = await res.json();
      console.log("datai ii", data);

      setAssignedProjects(data);
      setFormData((prev) => ({
        ...prev,
        SupervisorID: supervisorID,
        Site: data.map((p) => p.ProjectName).join(", "),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLaboursList();
  }, []);

  useEffect(() => {
    if (selectedProjectID) {
      getWorkDetails();
    }
  }, [selectedProjectID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      labour: selectedLabour?.ID,
      project_id: selectedLabour?.ProjectID,
      status,
      advance,
      mode,
      date,
      workDone,
      LabourType: selectedLabour?.LabType,
      workType: selectedWorkID,
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
      <div>
        <div className="container-fluid py-3">
          <ul className="nav nav-tabs mb-3" id="attendanceTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="labour-tab"
                data-bs-toggle="tab"
                data-bs-target="#labour"
                type="button"
                role="tab"
              >
                Labour Attendance
              </button>
            </li>

            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="supervisor-tab"
                data-bs-toggle="tab"
                data-bs-target="#supervisor"
                type="button"
                role="tab"
              >
                Supervisor Attendance
              </button>
            </li>
          </ul>

          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="labour"
              role="tabpanel"
            >
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
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
                        {selectedLabour?.LabType?.toLowerCase() ===
                        "misteri" ? (
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
                              disabled={isLabourSelected || status === "A"}
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
                      value={selectedLabour?.ID || ""}
                      onChange={(e) => {
                        const selected = AlllabourList.find(
                          (l) => l.ID === e.target.value,
                        );

                        console.log(selected);

                        setSelectedLabour(selected);
                        setSelectedProjectID(selected?.ProjectID || "");
                        setIsLabourSelected(false);
                      }}
                      required
                    >
                      <option value="">-- Select Labour --</option>

                      {AlllabourList.map((data) => (
                        <option key={data.ID} value={data.ID}>
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
                    {selectedLabour?.LabType?.toLowerCase() === "misteri" ? (
                      <>
                        <label className="py-3">Select work Type</label>
                        <select
                          className="form-select"
                          value={selectedWorkID}
                          onChange={(e) => setSelectedWorkID(e.target.value)}
                          required
                          disabled={isLabourSelected}
                        >
                          <option value="">-- Select Work Type --</option>

                          {workList.map((data) => (
                            <option key={data.WorkID} value={data.WorkID}>
                              {data.WorkName}
                            </option>
                          ))}
                        </select>
                      </>
                    ) : (
                      ""
                    )}
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

                <div className="text-end">
                  <button className="btn btn-primary px-4" type="submit">
                    Save Attendance
                  </button>
                </div>
              </form>
            </div>

            <div className="tab-pane fade" id="supervisor" role="tabpanel">
              <div className="card-body">
                <form onSubmit={saveAttendance}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Supervisor</label>

                      <select
                        className="form-select"
                        value={formData.SupervisorID}
                        onChange={handleSupervisorChange}
                      >
                        <option value="">Select Supervisor</option>

                        {supervisors.map((sup) => (
                          <option key={sup.ID} value={sup.ID}>
                            {sup.Name}
                          </option>
                        ))}
                      </select>

                      {assignedProjects.length > 0 && (
                        <div
                          style={{
                            marginTop: "10px",
                            padding: "12px",
                            background: "#f8f9fa",
                            borderRadius: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>Assigned Sites:</strong>

                          <div className="mt-2">
                            {assignedProjects.map((p) => (
                              <span
                                key={p.ProjectID}
                                className="badge bg-secondary me-2 mb-2"
                              >
                                {p.ProjectName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Date</label>

                      <input
                        type="date"
                        className="form-control"
                        name="AttendanceDate"
                        value={formData.AttendanceDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Status</label>

                      <select
                        className="form-select"
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                      >
                        <option value="P">Present</option>

                        <option value="A">Absent</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <button className="btn btn-primary" type="submit">
                        Save Attendance
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
