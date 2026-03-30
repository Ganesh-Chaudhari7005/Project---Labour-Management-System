import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useApi } from "./ApiCaller";
import { useState } from "react";

function CreateProject() {
  const callApi = useApi();

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientContact: "",
    clientImage: null,
    clientGender: "",
    clientAddress: "",
    systemAccess: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ToastContainer
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
        />

        <h4 className="mb-3">Create Project</h4>

        <p className="mb-2 page-head">Client Information</p>

        <div className="container remuser-cont p-3">
          <form>
            <div className="row">
              <div className="col-lg-4">
                <div className="form-divs">
                  <label className="custom-feild">
                    Client Name : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="profile-fields custom-text mb-3"
                    required
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-divs mb-3">
                  <label className="custom-feild">
                    Client Email : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleChange}
                    className="profile-fields custom-text"
                    required
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-divs">
                  <label className="custom-feild">
                    Client Contact : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    type="text"
                    name="clientContact"
                    value={formData.clientContact}
                    onChange={handleChange}
                    className="profile-fields custom-text"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-lg-4">
                <div className="form-divs">
                  <label className="custom-feild">Photo :</label>
                  <input
                    type="file"
                    name="clientImage"
                    onChange={handleChange}
                    className="profile-fields custom-text"
                  />
                </div>
              </div>

              <div className="col-lg-4 d-flex align-items-center">
                <div className="form-divs">
                  <label className="custom-feild">
                    Gender : <sup style={{ color: "red" }}>*</sup>
                  </label>

                  <label className="mx-2 custom-feild">
                    <input
                      type="radio"
                      name="clientGender"
                      value="male"
                      checked={formData.clientGender === "male"}
                      onChange={handleChange}
                      className="mx-2"
                      required
                    />
                    Male
                  </label>

                  <label className="mx-2 custom-feild">
                    <input
                      type="radio"
                      name="clientGender"
                      value="female"
                      checked={formData.clientGender === "female"}
                      onChange={handleChange}
                      className="mx-2"
                      required
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-lg-8">
                <label className="custom-feild">
                  Address : <sup style={{ color: "red" }}>*</sup>
                </label>
                <textarea
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleChange}
                  className="w-100 h-100 custom-feild"
                ></textarea>
              </div>
            </div>

            <div className="mb-3">
              <input
                type="checkbox"
                name="systemAccess"
                checked={formData.systemAccess}
                onChange={handleChange}
                id="access"
              />
              <label className="custom-feild mx-2" htmlFor="access">
                Give Client Access to System
              </label>
            </div>
          </form>

          <br />
          <p className="mb-2 page-head">Site Details</p>
        </div>
      </motion.div>
    </>
  );
}

export default CreateProject;
