import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiRoute } from "./ApiConfig";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
export default function ManageProjectWork() {
    const [loading, setLoading] = useState(true);
    const [newWorks, setNewWorks] = useState([
      {
        WorkName: "",
        TotalArea: "",
        Rate: "",
      },
    ]);
  const [works, setWorks] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [areaFilter, setAreaFilter] = useState("");
    const [completedAreaFilter, setCompletedAreaFilter] = useState("");
  const [selectedWork, setSelectedWork] = useState(null);
  const [newArea, setNewArea] = useState("");
    const filteredWorks = works.filter((work) => {
      const matchesSearch = work.WorkName.toLowerCase().includes(
        searchTerm.toLowerCase(),
      );

      const matchesArea =
        areaFilter === "" || Number(work.TotalArea) >= Number(areaFilter);

      const matchesCompletedArea =
        completedAreaFilter === "" ||
        Number(work.CompletedArea) >= Number(completedAreaFilter);

      return matchesSearch && matchesArea && matchesCompletedArea;
    });
  const { id } = useParams();

const addRow = () => {
  setNewWorks([
    ...newWorks,
    {
      WorkName: "",
      TotalArea: "",
      Rate: "",
    },
  ]);
};

const removeRow = (index) => {
  setNewWorks(newWorks.filter((_, i) => i !== index));
};

const handleChange = (index, field, value) => {
  const updated = [...newWorks];

  updated[index][field] = value;

  setNewWorks(updated);
};


const saveWorks = async () => {
  try {
    const invalid = newWorks.some(
      (w) => !w.WorkName.trim() || !w.TotalArea || !w.Rate,
    );

    if (invalid) {
      toast.error("Fill all fields");
      return;
    }

    const req = await fetch(`${ApiRoute}add-project-work`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ProjectID: id,
        works: newWorks,
      }),
    });

    const res = await req.json();

    if (req.ok) {
      toast.success("Work Added Successfully");

      getWorkDetails();

      setNewWorks([
        {
          WorkName: "",
          TotalArea: "",
          Rate: "",
        },
      ]);

      bootstrap.Modal.getInstance(
        document.getElementById("addWorkModal"),
      ).hide();
    } else {
      toast.error(res.message);
    }
  } catch (err) {
    console.log(err);
    toast.error("Server Error");
  }
};


const getWorkDetails = async () => {
  try {
    setLoading(true);

    const req = await fetch(`${ApiRoute}get-work-details/${id}`);
    const res = await req.json();

    setWorks(res);
  } catch (err) {
    console.log(err);
    toast.error("Failed to load data");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getWorkDetails();
  }, [id]);

  const openModal = (work) => {
    setSelectedWork(work);
    setNewArea(work.TotalArea);

    const modal = new bootstrap.Modal(
      document.getElementById("updateAreaModal"),
    );

    modal.show();
  };

  const updateTotalArea = async () => {
    try {
      const req = await fetch(`${ApiRoute}update-total-area`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          WorkID: selectedWork.WorkID,
          TotalArea: newArea,
        }),
      });

      const res = await req.json();

      if (req.ok) {
        toast.success("Total Area Updated");

        getWorkDetails();

        const modal = bootstrap.Modal.getInstance(
          document.getElementById("updateAreaModal"),
        );

        modal.hide();
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mt-4">
          <div className="card-body">
            <h3 className="mb-3 text-center d-lg-none">Manage Works</h3>
            <div className="row mb-3 g-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Work Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Search by Total Area"
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Search by Completed Area"
                  value={completedAreaFilter}
                  onChange={(e) => setCompletedAreaFilter(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <div className="d-flex gap-4 px-0 px-lg-3">
                  <button
                    className="btn btn-outline-secondary mng-work-res"
                    onClick={() => {
                      setSearchTerm("");
                      setAreaFilter("");
                      setCompletedAreaFilter("");
                    }}
                  >
                    Clear Filter
                  </button>
                  <button
                    className="area-update-btn mng-work-res"
                    onClick={() => {
                      const modal = new bootstrap.Modal(
                        document.getElementById("addWorkModal"),
                      );
                      modal.show();
                    }}
                  >
                    + Add Work
                  </button>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered  align-middle">
                <thead>
                  <tr>
                    <th className="tbl-head">Sr. No.</th>
                    <th className="tbl-head">Work Name</th>
                    <th className="tbl-head">Total Area</th>
                    <th className="tbl-head">Completed Area</th>
                    <th className="tbl-head">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, index) => (
                      <tr key={index}>
                        <td>
                          <div className="skeleton-box"></div>
                        </td>
                        <td>
                          <div className="skeleton-box"></div>
                        </td>
                        <td>
                          <div className="skeleton-box"></div>
                        </td>
                        <td>
                          <div className="skeleton-box"></div>
                        </td>
                        <td>
                          <div className="skeleton-btn"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredWorks.length > 0 ? (
                    filteredWorks.map((work, index) => (
                      <tr key={work.WorkID}>
                        <td>{index + 1}</td>
                        <td>{work.WorkName}</td>
                        <td>{work.TotalArea} sq.ft</td>
                        <td>{work.CompletedArea} sq.ft</td>
                        <td>
                          <button
                            className="area-update-btn"
                            onClick={() => openModal(work)}
                          >
                            Update Area
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No Records Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        <div
          className="modal fade"
          id="updateAreaModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Total Area</h5>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                />
              </div>

              <div className="modal-body">
                {selectedWork && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Work Name</label>

                      <input
                        type="text"
                        className="form-control"
                        value={selectedWork.WorkName}
                        disabled
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Total Area</label>

                      <input
                        type="number"
                        className="form-control"
                        value={newArea}
                        onChange={(e) => setNewArea(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={updateTotalArea}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="addWorkModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Project Work</h5>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                />
              </div>

              <div className="modal-body">
                {newWorks.map((work, index) => (
                  <div
                    key={index}
                    className="row border rounded p-3 mb-3 align-items-center"
                  >
                    <div className="col-md-4">
                      <label className="form-label">Work Name</label>

                      <input
                        type="text"
                        className="form-control"
                        value={work.WorkName}
                        onChange={(e) =>
                          handleChange(index, "WorkName", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Total Area</label>

                      <input
                        type="number"
                        className="form-control"
                        value={work.TotalArea}
                        onChange={(e) =>
                          handleChange(index, "TotalArea", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Rate</label>

                      <input
                        type="number"
                        className="form-control"
                        value={work.Rate}
                        onChange={(e) =>
                          handleChange(index, "Rate", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label">Amount</label>

                      <div className="fw-bold text-success">
                        ₹{" "}
                        {(
                          (Number(work.TotalArea) || 0) *
                          (Number(work.Rate) || 0)
                        ).toLocaleString()}
                      </div>

                      {newWorks.length > 1 && (
                        <button
                          className="btn btn-danger btn-sm mt-2"
                          onClick={() => removeRow(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button className="btn btn-outline-primary" onClick={addRow}>
                  + Add More Work
                </button>

                <div className="mt-4 p-3 border rounded bg-light d-flex justify-content-between">
                  <span className="fw-bold">Grand Total</span>

                  <span className="fw-bold text-success">
                    ₹{" "}
                    {newWorks
                      .reduce(
                        (sum, work) =>
                          sum +
                          (Number(work.TotalArea) || 0) *
                            (Number(work.Rate) || 0),
                        0,
                      )
                      .toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>

                <button className="area-update-btn" onClick={saveWorks}>
                  Save Work
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
