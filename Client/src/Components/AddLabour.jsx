import React from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
export default function AddLabour() {
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
                    className="profile-fields  custom-text mb-3"
                    required
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
                    type="text"
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
                    id="labourWages"
                    className="profile-fields  custom-text"
                    required
                  />
                </div>
              </div>
              <div className="col-lg-4 d-flex align-items-center">
                <div className="form-divs">
                  <label htmlFor="labourWages" className="custom-feild">
                    Date of birth : <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <br />
                  <input
                    type="date"
                    id="labourWages"
                    className="profile-fields  custom-text p-2"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="row mb-5">
              <div className="col-lg-8">
                <label htmlFor="address" className="custom-feild">
                  Address :{" "}
                </label>
                <br />
                <textarea className="w-100 h-100"></textarea>
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
                      value="Male"
                      required
                    />
                    Male
                  </label>
                  <label className="mx-2 custom-feild">
                    <input
                      className="mx-2"
                      type="radio"
                      name="gendergrp"
                      value="female"
                      required
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <input type="checkbox" name="" id="access" />
              <label className="custom-feild mx-2" htmlFor="access">
                Give Labour Access to System
              </label>
            </div>
            <div className="d-flex">
              <button type="submit" className="defbtn">Add Labour</button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}
