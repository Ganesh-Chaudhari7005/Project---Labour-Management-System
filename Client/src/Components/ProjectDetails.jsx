import React , {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { useApi } from "./ApiCaller";
import { ApiRoute } from "./ApiConfig";
import { motion } from 'framer-motion';
import { toast, ToastContainer } from "react-toastify";
export default function ProjectDetails() {
    const callApi = useApi();
    const [projectDetails, setprojectdetails] = useState({});
      const [clientDetails, setClientDetails] = useState({});
     const { id } = useParams();
 const getProjectDetails = async () => {
   const reqPrj = await callApi(`${ApiRoute}getProject-details`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({ id }),
   });

   setprojectdetails(reqPrj.projectdetails);
   setClientDetails(reqPrj.clientDetails);
 };

 useEffect(() => {
   getProjectDetails();
 }, []);
     console.log(projectDetails);
     console.log(clientDetails);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <div className="details-cont">
        <div className="row">
          <h4 className="mb-2 d-inline-block">
            Project : {projectDetails.project_name || "Loading"}
          </h4>
          <div className="col-lg-4">
            <p className="projInfo">Client : {clientDetails.Name || ""}</p>
            <p className="projInfo">
              Client Contact: {clientDetails.Phone || ""}
            </p>
            <p className="projInfo">
              Client Address: {clientDetails.Address || ""}
            </p>
          </div>
          <div className="col-lg-4">
            <p className="projInfo">
              Rate(Sq. Ft.) : {projectDetails.builtup_rate || ""}
            </p>
            <p className="projInfo">
              Project Duration : {projectDetails.work_duration || ""}
            </p>
            <p className="projInfo">
              Site Address: {projectDetails.site_address || ""}
            </p>
          </div>
          <div className="col-lg-4"></div>
        </div>
      </div>
    </motion.div>
  );
}
