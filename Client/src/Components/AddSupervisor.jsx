import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { ApiRoute } from "./ApiConfig.js";
import { useApi } from "./ApiCaller.js";

export default function AddSupervisor() {
  const callApi = useApi();

  const [supervisorName, setSupervisorName] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [supContact, setSupContact] = useState("");
  const [supAddress, setSupAddress] = useState("");
  const [supSalary, setSupSalary] = useState("");
  const [hasSystemAccess, setSystemAccess] = useState(false);
  const [supImage, setSupImage] = useState(null);

  const ValidateSupervisorDetails = (e) => {
    e.preventDefault();

    const trimName = supervisorName.trim();
    const trimContact = supContact.trim();
    const trimEmail = supEmail.trim();
    const trimAddress = supAddress.trim();
    const trimSalary = supSalary.trim();

    if (
      !trimName ||
      !trimEmail ||
      !trimContact ||
      !trimAddress ||
      !trimSalary
    ) {
      toast.error("Fill all required details");
    } else if (trimContact.length !== 10) {
      toast.error("Enter valid phone number");
    } else if (Number(trimSalary) <= 0) {
      toast.error("Salary should be greater than 0");
    } else {
      HandleAddSupervisor();
    }
  };

  const HandleAddSupervisor = async () => {
    try {
      const formData = new FormData();

      formData.append("SupervisorName", supervisorName);
      formData.append("SupervisorEmail", supEmail);
      formData.append("SupervisorContact", supContact);
      formData.append("SupervisorAddress", supAddress);
      formData.append("SupervisorSalary", supSalary);
      formData.append("SupervisorAccess", hasSystemAccess);

      // Important for multer
      if (supImage) {
        formData.append("SupervisorPhoto", supImage);
      }

      const response = await callApi(`${ApiRoute}add-Supervisor`, {
        method: "POST",
        body: formData,
      });

      if (response?.success) {
        toast.success(response.message);

        setSupervisorName("");
        setSupEmail("");
        setSupContact("");
        setSupAddress("");
        setSupSalary("");
        setSupImage(null);
        setSystemAccess(false);
      } else {
        toast.error(response?.message || "Failed to add supervisor");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
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

        <div className="container remuser-cont p-3">
          <h4 className="mb-5 d-inline-block">Add Supervisor</h4>

          <form>
            <div className="row">
              <div className="col-lg-4">
                <div className="form-divs">
                  <label htmlFor="supervisorName" className="custom-feild">
                    Supervisor Name :<sup style={{ color: "red" }}>*</sup>
                  </label>

                  <input
                    type="text"
                    id="supervisorName"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className="profile-fields custom-text mb-3"
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-divs mb-3">
                  <label htmlFor="supEmail" className="custom-feild">
                    Supervisor Email :<sup style={{ color: "red" }}>*</sup>
                  </label>

                  <input
                    type="email"
                    value={supEmail}
                    onChange={(e) => setSupEmail(e.target.value)}
                    id="supEmail"
                    className="profile-fields custom-text"
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-divs">
                  <label htmlFor="supContact" className="custom-feild">
                    Supervisor Contact :<sup style={{ color: "red" }}>*</sup>
                  </label>

                  <input
                    type="text"
                    id="supContact"
                    value={supContact}
                    onChange={(e) => setSupContact(e.target.value)}
                    className="profile-fields custom-text"
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
                    style={{
                      paddingTop: "4px",
                      paddingLeft: "4px",
                      height: "40px",
                    }}
                    onChange={(e) => setSupImage(e.target.files[0])}
                    className="profile-fields custom-text"
                  />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="form-divs">
                  <label htmlFor="supSalary" className="custom-feild">
                    Monthly Salary :<sup style={{ color: "red" }}>*</sup>
                  </label>

                  <input
                    type="number"
                    value={supSalary}
                    onChange={(e) => setSupSalary(e.target.value)}
                    id="supSalary"
                    className="profile-fields custom-text"
                  />
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-lg-8">
                <label htmlFor="address" className="custom-feild">
                  Address :<sup style={{ color: "red" }}>*</sup>
                </label>

                <textarea
                  className="w-100 h-100 custom-feild"
                  value={supAddress}
                  onChange={(e) => setSupAddress(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="mb-3">
              <input
                type="checkbox"
                checked={hasSystemAccess}
                onChange={() => setSystemAccess((prev) => !prev)}
                id="access"
              />

              <label className="custom-feild mx-2" htmlFor="access">
                Give Supervisor Access to System
              </label>
            </div>

            <div className="w-100 p-3">
              <button
                type="submit"
                className="defbtn"
                onClick={ValidateSupervisorDetails}
              >
                Add Supervisor
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
