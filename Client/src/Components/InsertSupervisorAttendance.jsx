import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig";

export default function SupervisorAttendance() {
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
      const res = await fetch(`${ApiRoute}/supervisors`);

      const data = await res.json();

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

    try {
      const res = await fetch(`${ApiRoute}/supervisor/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      alert(data.message);

      if (data.success) {
        setFormData({
          SupervisorID: "",
          AttendanceDate: new Date().toISOString().split("T")[0],
          Status: "P",
          Site: "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header">
          <h4 className="mb-0">Supervisor Attendance</h4>
        </div>

        <div className="card-body">
          <form onSubmit={saveAttendance}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Supervisor</label>

                <select
                  className="form-select"
                  name="SupervisorID"
                  value={formData.SupervisorID}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Supervisor</option>

                  {supervisors.map((sup) => (
                    <option key={sup.ID} value={sup.ID}>
                      {sup.Name}
                    </option>
                  ))}
                </select>
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

              <div className="col-md-6">
                <label className="form-label">Site</label>

                <input
                  type="text"
                  className="form-control"
                  name="Site"
                  value={formData.Site}
                  onChange={handleChange}
                  placeholder="Site Name"
                  required
                />
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
  );
}
