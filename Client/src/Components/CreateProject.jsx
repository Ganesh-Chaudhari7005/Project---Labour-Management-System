import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useApi } from "./ApiCaller";
import { useState } from "react";
import { ApiRoute } from "./ApiConfig.js";

function CreateProject() {
  const callApi = useApi();

  const [loading, setLoading] = useState(false);

 const [formData, setFormData] = useState({
   clientName: "",
   clientEmail: "",
   clientContact: "",
   clientImage: null,
   clientAddress: "",
   systemAccess: false,
   isGSTRegistered: false,
   gstin: "",
   ProjectName: "",
   Startdate: "",
   Enddate: "",
   SiteAddress: "",
 });

  const [customWork, setCustomWork] = useState({
    name: "",
    total: "",
    rate: "",
  });

  const handleAddCustomWork = () => {
    if (!customWork.name.trim()) {
      toast.error("Enter work name");
      return;
    }

    if (!customWork.total || !customWork.rate) {
      toast.error("Enter sqft and rate");
      return;
    }

    const key = customWork.name.toLowerCase().replaceAll(" ", "_");

    setWorks((prev) => ({
      ...prev,
      [key]: {
        total: customWork.total,
        rate: customWork.rate,
        custom: true,
        label: customWork.name,
      },
    }));

    // reset input
    setCustomWork({
      name: "",
      total: "",
      rate: "",
    });
  };
  // ✅ FIXED: works as object
  const [works, setWorks] = useState({});

  const workList = [
    "Flooring",
    "Dado Tiles",
    "Kitchen_Counter",
    "Skirting",
    "Door frames",
    "Window Frames",
    "Parking Tiles",
    "Stairs",
    "Stairs Skirting"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        ...(name === "isGSTRegistered" && !checked && { gstin: "" }),
      }));
    }
  };

  // ✅ Updated works handler
  const handleWorkCheck = (e) => {
    const { value, checked } = e.target;

    setWorks((prev) => {
      if (checked) {
        return { ...prev, [value]: { total: "" } };
      } else {
        const updated = { ...prev };
        delete updated[value];
        return updated;
      }
    });
  };

  const handleSqftChange = (work, value) => {
    setWorks((prev) => ({
      ...prev,
      [work]: { total: value },
    }));
  };

  const validateForm = () => {
    if (!formData.clientName.trim()) {
      toast.error("Client Name required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      toast.error("Invalid Email");
      return false;
    }

    if (!/^[0-9]{10}$/.test(formData.clientContact)) {
      toast.error("Enter valid 10 digit contact");
      return false;
    }

    if (!formData.clientAddress.trim()) {
      toast.error("Address required");
      return false;
    }

    if (!formData.ProjectName.trim()) {
      toast.error("Project Name required");
      return false;
    }

    if (!formData.Startdate.trim()) {
      toast.error("Work Duration required");
      return false;
    }


    if (Object.keys(works).length === 0) {
      toast.error("Select at least one work");
      return false;
    }

    if (formData.isGSTRegistered) {
      if (!formData.gstin.trim()) {
        toast.error("GSTIN required for GST registered client");
        return false;
      }

      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

      if (!gstRegex.test(formData.gstin)) {
        toast.error("Invalid GSTIN format");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const finalData = {
      ...formData,
      works,
    };

    try {
      let req = await callApi(`${ApiRoute}create-project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ finalData }),
      });

      if (req.success) {
        toast.success(req.message);
      } else {
        toast.error(req.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="container mt-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <ToastContainer />

      <h3 className="fw-bold mb-4">Create Project</h3>

      <form onSubmit={handleSubmit}>
        {/* CLIENT INFO */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="text-custom mb-3">Client Information</h5>

            <div className="row">
              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  name="clientName"
                  placeholder="Client Name"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="email"
                  name="clientEmail"
                  placeholder="Client Email"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="text"
                  name="clientContact"
                  placeholder="Contact Number"
                  value={formData.clientContact}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="file"
                  name="clientImage"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-8 mb-3">
                <textarea
                  name="clientAddress"
                  placeholder="Client Address"
                  value={formData.clientAddress}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                name="systemAccess"
                checked={formData.systemAccess}
                onChange={handleChange}
                className="form-check-input"
                id="access"
              />
              <label className="form-check-label" htmlFor="access">
                Give Client Access
              </label>
            </div>
            {/* GST REGISTERED */}
            <div className="form-check mt-2">
              <input
                type="checkbox"
                name="isGSTRegistered"
                checked={formData.isGSTRegistered}
                onChange={handleChange}
                className="form-check-input"
                id="gstCheck"
              />
              <label className="form-check-label" htmlFor="gstCheck">
                GST Registered Client
              </label>
            </div>

            {/* GSTIN INPUT (only if checked) */}
            {formData.isGSTRegistered && (
              <div className="mt-3">
                <input
                  type="text"
                  name="gstin"
                  placeholder="Enter GSTIN"
                  value={formData.gstin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      gstin: e.target.value.toUpperCase(), // 🔥 auto uppercase
                    }))
                  }
                  className="form-control"
                />
              </div>
            )}
          </div>
        </div>

        {/* SITE DETAILS */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="text-custom mb-3">Site Details</h5>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="ProjectName" className="mb-2">
                  Project Name :{" "}
                </label>

                <input
                  type="text"
                  name="ProjectName"
                  value={formData.ProjectName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="Startdate" className="mb-2">
                  Start Date :{" "}
                </label>
                <input
                  type="date"
                  name="Startdate"
                  placeholder="Start Date"
                  value={formData.Startdate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label htmlFor="Enddate" className="mb-2">
                  Estimated End Date :{" "}
                </label>
                <input
                  type="date"
                  name="Enddate"
                  value={formData.Enddate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-12 mb-3">
                <textarea
                  name="SiteAddress"
                  placeholder="Site Address"
                  value={formData.SiteAddress}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        {/* WORK SELECTION */}
        {/* WORK SELECTION */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="text-custom mb-3">Select Work</h5>

            {/* WORK CARDS */}
            <div className="row">
              {workList.map((work) => {
                const isSelected = works[work];

                return (
                  <div className="col-md-4 mb-3" key={work}>
                    <div
                      className={`p-3 border rounded text-center ${
                        isSelected ? "selected-work" : "work-card"
                      }`}
                      style={{ cursor: "pointer", transition: "0.2s" }}
                      onClick={() =>
                        handleWorkCheck({
                          target: {
                            value: work,
                            checked: !isSelected,
                          },
                        })
                      }
                    >
                      <div className="fw-semibold text-capitalize">
                        {work.replaceAll("_", " ")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CUSTOM WORK */}
            <div className="mt-4 p-3 border rounded">
              <h6 className="mb-3">Add Custom Work</h6>

              <div className="row">
                <div className="col-md-3 mb-2">
                  <input
                    type="text"
                    placeholder="Work Name"
                    className="form-control"
                    value={customWork.name}
                    onChange={(e) =>
                      setCustomWork((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="col-md-3 mb-2">
                  <input
                    type="number"
                    placeholder="Sqft"
                    className="form-control"
                    value={customWork.total}
                    onChange={(e) =>
                      setCustomWork((prev) => ({
                        ...prev,
                        total: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="col-md-3 mb-2">
                  <input
                    type="number"
                    placeholder="Rate"
                    className="form-control"
                    value={customWork.rate}
                    onChange={(e) =>
                      setCustomWork((prev) => ({
                        ...prev,
                        rate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div
                  className="col-md-3 mb-2"
                  style={{ position: "relative", bottom: "4px" }}
                >
                  <button
                    type="button"
                    className="rounded w-100"
                    onClick={handleAddCustomWork}
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* INPUT SECTION */}
            {Object.keys(works).length > 0 && (
              <div className="mt-4">
                <h6 className="mb-3">Work Details</h6>

                {Object.keys(works).map((work) => (
                  <div
                    key={work}
                    className="d-flex align-items-center gap-3 mb-3 p-2 border rounded"
                  >
                    <div
                      className="text-capitalize fw-medium"
                      style={{ width: "200px" }}
                    >
                      {works[work]?.custom
                        ? works[work].label
                        : work.replaceAll("_", " ")}
                    </div>

                    <input
                      type="number"
                      placeholder="Sqft"
                      className="form-control"
                      style={{ maxWidth: "120px" }}
                      value={works[work]?.total || ""}
                      onChange={(e) =>
                        setWorks((prev) => ({
                          ...prev,
                          [work]: {
                            ...prev[work],
                            total: e.target.value,
                          },
                        }))
                      }
                    />

                    <input
                      type="number"
                      placeholder="Rate"
                      className="form-control"
                      style={{ maxWidth: "120px" }}
                      value={works[work]?.rate || ""}
                      onChange={(e) =>
                        setWorks((prev) => ({
                          ...prev,
                          [work]: {
                            ...prev[work],
                            rate: e.target.value,
                          },
                        }))
                      }
                    />

                    <div
                      className="fw-semibold text-success"
                      style={{ minWidth: "120px" }}
                    >
                      ₹{" "}
                      {(
                        (Number(works[work]?.total) || 0) *
                        (Number(works[work]?.rate) || 0)
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* GRAND TOTAL */}
          <div className="mt-3 p-3 border rounded bg-light d-flex justify-content-between">
            <span className="fw-bold fs-5">Grand Total</span>
            <span className="fw-bold fs-5 text-success">
              ₹{" "}
              {Object.keys(works)
                .reduce((sum, key) => {
                  const item = works[key];
                  return (
                    sum + (Number(item.total) || 0) * (Number(item.rate) || 0)
                  );
                }, 0)
                .toLocaleString()}
            </span>
          </div>
        </div>

        <button
          className="btn btn-primary w-100 cust-prj-btn"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </motion.div>
  );
}

export default CreateProject;
