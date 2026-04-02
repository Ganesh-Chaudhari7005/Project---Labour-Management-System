import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { useApi } from "./ApiCaller";
import { useState } from "react";
import  {ApiRoute} from "./ApiConfig.js";
function CreateProject() {
  const callApi = useApi();

  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientContact: "",
    clientImage: null,
    clientAddress: "",
    systemAccess: false,
    ProjectName: "",
    ProjectAddress: "",
    WorkDuration: "",
    BuiltupRate: "",
    SiteAddress : ""
  });

  const [works, setWorks] = useState([]);

  const workList = [
    "flooring",
    "dado_tiles",
    "kitchen_counter",
    "skirting",
    "door_frames",
    "window_frames",
    "parking_tiles",
    "stairs",
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
  };

  const handleWorkCheck = (e) => {
  const { value, checked } = e.target;

  setWorks((prev) => {
    if (checked) {
      // add work name
      return [...prev, value];
    } else {
      // remove work name
      return prev.filter((item) => item !== value);
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

    if (!formData.clientEmail.trim()) {
      toast.error("Client Email required");
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

    if (!formData.WorkDuration.trim()) {
      toast.error("Work Duration required");
      return false;
    }

    if (!formData.BuiltupRate || isNaN(formData.BuiltupRate)) {
      toast.error("Enter valid Built-up Rate");
      return false;
    }

    if (Object.keys(works).length === 0) {
      toast.error("Select at least one work");
      return false;
    }

    

    return true;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const finalData = {
      ...formData,
      works,
    };

    let req = await callApi(`${ApiRoute}create-project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({finalData}),
    });
   
    if(req.success){
       toast.success(req.message);
    }else{
       toast.error(req.message);
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
          <form onSubmit={handleSubmit}>
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
            <br />
        
            <p className="mb-2 page-head">Site Details</p>
            <div className="row py-3">
              <div className="col-lg-4">
                <div className="form-divs">
                  <label className="custom-feild">Site Name :</label>
                  <input
                    type="text"
                    name="ProjectName"
                    value={formData.ProjectName}
                    onChange={handleChange}
                    className="profile-fields custom-text mb-3"
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <label className="custom-feild">Work Duration :</label>
                <input
                  type="text"
                  name="WorkDuration"
                  value={formData.WorkDuration}
                  onChange={handleChange}
                  className="profile-fields custom-text mb-3"
                />
              </div>

              <div className="col-lg-4">
                <label className="custom-feild">Built-Up Rate :</label>
                <input
                  type="text"
                  name="BuiltupRate"
                  value={formData.BuiltupRate}
                  onChange={handleChange}
                  className="profile-fields custom-text mb-3"
                />
              </div>
            </div>
            <label className="custom-feild">Select Work :</label>
            <div className="container">
              <div className="row">
                {workList.map((work) => (
                  <div className="col-lg-4" key={work}>
                    <div className="form-divs">
                      <input
                        type="checkbox"
                        value={work}
                        onChange={handleWorkCheck}
                      />
                      <label className="text-capitalize mx-2 custom-feild">
                        {work.replaceAll("_", " ")}
                      </label>
                    </div>
                  </div>
                ))}
              </div><br/>
              <div className="row p-0 mb-5">
                <div className="col-lg-8 p-0">
                  <label className="custom-feild">
                    Site Address : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <textarea
                    name="SiteAddress"
                    value={formData.SiteAddress}
                    onChange={handleChange}
                    className="w-100 h-100 custom-feild"
                    required 
                  ></textarea>
                </div>
              </div>
            </div>
            <button className="btn btn-primary mt-3">Create Project</button>
          </form>
        </div>
      </motion.div>
    </>
  );
}

export default CreateProject;
