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
     console.log(id);
     
 const getProjectDetails = async () => {
  console.log("Sending ID:", id, typeof id);
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
   console.log(clientDetails);
   console.log(projectDetails);
   
 }, []);
     const formatDate = (date) => {
       if (!date) return "---";

       return new Date(date).toLocaleDateString("en-IN", {
         timeZone: "Asia/Kolkata",
         day: "numeric",
         month: "long",
         year: "numeric",
       });
     };
  return (
    <motion.div
      className="pd3-wrapper"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ToastContainer />

      <div className="pd3-card">
        <h4 className="pd3-title">Client Details</h4>

        <p>
          <span>Name:</span> {clientDetails?.Name || "---"}
        </p>
        <p>
          <span>Contact:</span> {clientDetails?.Phone || "---"}
        </p>
        <p>
          <span>Email:</span> {clientDetails?.Email || "---"}
        </p>
        <p>
          <span>Address:</span> {clientDetails?.Address || "---"}
        </p>
        <p>
          <span>GSTIN:</span> {clientDetails?.gsting || "Not Available"}
        </p>
      </div>

      <div className="pd3-card">
        <h4 className="pd3-title">Project Details</h4>

        <p>
          <span>Site Name</span> {projectDetails?.ProjectName || "---"}
        </p>
        <p>
          <span>Site Address</span> {projectDetails?.Address || "---"}
        </p>
        <p>
          <span>Start Date</span> {formatDate(projectDetails?.StartDate)}
        </p>
        <p>
          <span>End Date</span> {formatDate(projectDetails?.EndDate)}
        </p>
      </div>
    </motion.div>
  );
}
