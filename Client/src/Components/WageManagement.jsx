import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig";
import { toast, ToastContainer } from "react-toastify";

export default function WageManagement() {
  const [labours, setLabours] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [wageValue, setWageValue] = useState("");

  const fetchData = async () => {
    const res = await fetch(`${ApiRoute}get-wages`);
    const data = await res.json();
    setLabours(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveWage = async (labourID) => {
    if (!wageValue) return toast.error("Enter wage amount");

    const res = await fetch(`${ApiRoute}update-wage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labourID, wages: wageValue }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Wage updated successfully");
      setEditingId(null);
      setWageValue("");
      fetchData();
    } else {
      toast.error(data.message || "Error updating wage");
    }
  };

  return (
    <div className="wage-page">
      <ToastContainer />

      {/* HEADER */}
      <div className="wage-header">
        <div>
          <h2>💰 Wage Management</h2>
          <p>Manage labour wages efficiently</p>
        </div>

        <div className="wage-count">Total Labours: {labours.length}</div>
      </div>

      {/* TABLE */}
      <div className="wage-table-container">
        <table className="wage-table">
          <thead>
            <tr>
              <th>Labour Name</th>
              <th>Email</th>
              <th>Wage (₹)</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {labours.map((l) => (
              <tr key={l.ID}>
                <td className="name-cell">{l.Name}</td>
                <td>{l.Email}</td>

                <td>
                  {editingId === l.ID ? (
                    <input
                      type="number"
                      className="wage-input"
                      value={wageValue}
                      onChange={(e) => setWageValue(e.target.value)}
                      placeholder="Enter wage"
                    />
                  ) : (
                    <span className="wage-badge">₹ {l.wages || "Not Set"}</span>
                  )}
                </td>

                <td>
                  {editingId === l.ID ? (
                    <div className="btn-group">
                      <button
                        className="btn-save"
                        onClick={() => saveWage(l.ID)}
                      >
                        Save
                      </button>

                      <button
                        className="btn-cancel"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingId(l.ID);
                        setWageValue(l.wages || "");
                      }}
                    >
                      Edit Wage
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
