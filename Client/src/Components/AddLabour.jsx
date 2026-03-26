import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { ApiRoute } from "./ApiConfig.js";
import { useApi } from "./ApiCaller.js";
export default function AddLabour() {
  const callApi = useApi()
  const [LabourName, setLabName] = useState("");
  const [LabourEmail, setLabEmail] = useState("");
  const [LabourContact, setLabContact] = useState("");
  const [LabourAddress, setLabAddress] = useState("");
  const [LabourGender, setLabGender] = useState("");
  const [LabourDOB, setLabDOB] = useState("");
  const [Labourwage, setLabwage] = useState("");
  const [hasSystemAccess, setSystemAccess] = useState(false);
  const [labImage, setLabImage] = useState("");
  const [LabType , setLabType] = useState("");

  const ValLabDetails = (e) => {
    e.preventDefault();
    const trimLabName = LabourName.trim();
    const trimLabContact = LabourContact.trim();
    const trimLabEmail = LabourEmail.trim();
    const trimLabAddr = LabourAddress.trim();
    const trimWage = Labourwage.trim();
    const today = new Date().toISOString().split("T")[0];

    if (
      !trimLabName ||
      !trimLabEmail ||
      !trimLabContact ||
      !trimLabAddr ||
      !trimWage ||
      !LabourDOB ||
      !LabourGender
    ) {
      toast.error("Fill required details");
    } else if (trimLabContact.length > 10 || trimLabContact.length < 10) {
      toast.error("Enter a Valid Phone Number");
    } else if (LabourDOB > today) {
      toast.error("Invalid Date");
    }else if(Labourwage === 0){
      toast.error("Wage should be greater than 0");
    } else if(LabType === ""){
      toast.error("Select Labour Type");
    }
    else {
      HandleAddLab();
    }
  };

  const HandleAddLab = async()=>{
      const formdata = new FormData();

      formdata.append("LabName" , LabourName);
      formdata.append("LabEmail", LabourEmail);
      formdata.append("LabContact", LabourContact);
      formdata.append("LabAddr", LabourAddress);
      formdata.append("LabWage", Labourwage);
      formdata.append("LabGen", LabourGender);
      formdata.append("Labdob", LabourDOB);
      formdata.append("LabPhoto", labImage);
      formdata.append("LabAccess", hasSystemAccess);
      formdata.append("LabType", LabType);
      const resjsondata = await callApi(`${ApiRoute}add-Labour`, {
        method: "POST",
        body: formdata,
      });

      if(resjsondata?.success){
        toast.success(resjsondata?.message);     
    }
      else{
        toast.error(resjsondata?.message);
      }
      console.log(resjsondata);
      
      
  }

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
          <h4 className="mb-5 d-inline-block">Add Labour</h4>
          <form>
            <div className="row">
              <div className="col-lg-4">
                <div className="form-divs">
                  <label htmlFor="labourName" className="custom-feild">
                    Labour Name : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <br />
                  <input
                    type="text"
                    id="labourName"
                    value={LabourName}
                    onChange={(e) => {
                      setLabName(e.target.value);
                    }}
                    className="profile-fields  custom-text mb-3"
                    required={true}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-divs mb-3">
                  <label htmlFor="labourEmail" className="custom-feild">
                    Labour Email : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <br />
                  <input
                    type="email"
                    value={LabourEmail}
                    onChange={(e) => {
                      setLabEmail(e.target.value);
                    }}
                    id="labourEmail"
                    className="profile-fields  custom-text"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-divs">
                  <label htmlFor="labourContact" className="custom-feild">
                    Labour Contact : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <br />
                  <input
                    type="text"
                    id="labourContact"
                    value={LabourContact}
                    onChange={(e) => {
                      setLabContact(e.target.value);
                    }}
                    className="profile-fields  custom-text"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-lg-4">
                <div className="form-divs">
                  <label htmlFor="labourContact" className="custom-feild">
                    Photo :
                  </label>
                  <br />
                  <input
                    style={{
                      paddingTop: "4px",
                      paddingLeft: "4px",
                      height: "40px",
                    }}
                    type="file"
                    onChange={(e) => {
                      setLabImage(e.target.files[0]);
                    }}
                    id="labourContact"
                    className="profile-fields  custom-text"
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="form-divs">
                  <label htmlFor="labourWages" className="custom-feild">
                    Daily Wage : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <br />
                  <input
                    type="text"
                    value={Labourwage}
                    onChange={(e) => {
                      setLabwage(e.target.value);
                    }}
                    id="labourWages"
                    className="profile-fields  custom-text"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-4 d-flex align-items-center">
                <div className="row w-100">
                  <div className="col-lg-6">
                    <div className="form-divs">
                      <label htmlFor="labBOB" className="custom-feild">
                        Date of birth : <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <br />
                      <input
                        type="date"
                        id="labBOB"
                        value={LabourDOB}
                        onChange={(e) => {
                          setLabDOB(e.target.value);
                        }}
                        className="profile-fields  custom-text p-2"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-divs">
                      <label htmlFor="labtype" className="custom-feild">
                        Labour Type : <sup style={{ color: "red" }}>*</sup>
                      </label>
                    </div>
                    <select
                      value={LabType}
                      onChange={(e) => setLabType(e.target.value)}
                      className="w-100 custom-feild profile-fields"
                      name="labtype"
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="Misteri">Misteri</option>
                      <option value="Helper">Helper</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-lg-8">
                <label htmlFor="address" className="custom-feild">
                  Address : <sup style={{ color: "red" }}>*</sup>
                </label>
                <br />
                <textarea
                  className="w-100 h-100 custom-feild"
                  value={LabourAddress}
                  onChange={(e) => {
                    setLabAddress(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className="col-lg-4 d-flex align-items-center">
                <div className="form-divs">
                  <label className="custom-feild">
                    Gender : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <label className="mx-2 custom-feild">
                    <input
                      className="mx-2"
                      type="radio"
                      name="gendergrp"
                      checked={LabourGender === "male"}
                      onChange={(e) => setLabGender(e.target.value)}
                      value="male"
                      required
                    />
                    Male
                  </label>
                  <label className="mx-2 custom-feild">
                    <input
                      className="mx-2"
                      type="radio"
                      name="gendergrp"
                      checked={LabourGender === "female"}
                      onChange={(e) => setLabGender(e.target.value)}
                      value="female"
                      required
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <input
                type="checkbox"
                value={hasSystemAccess}
                onChange={() => {
                  setSystemAccess((prev) => (prev = !prev));
                }}
                name=""
                id="access"
              />
              <label className="custom-feild mx-2" htmlFor="access">
                Give Labour Access to System
              </label>
            </div>
            <div className="w-100 p-3">
              <button
                type="submit"
                style={{ position: "relative" }}
                className="defbtn"
                onClick={(e) => ValLabDetails(e)}
              >
                Add Labour
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
