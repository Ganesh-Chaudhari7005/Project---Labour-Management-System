import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ApiRoute } from './ApiConfig';
import { useState } from 'react';
import { motion } from 'framer-motion';
export default function ProjectStatus() {
    const {id} = useParams();
    const[workDetails, setWorkDetails] = useState([]);
    const fetchStatus = async()=>{
        console.log("Sending", id);
        
        const reqStatus = await fetch(`${ApiRoute}get-project-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        const res = await reqStatus.json();
        setWorkDetails(res);            
    }

useEffect(()=>{
    fetchStatus();      
}, [])
const totalArea = workDetails.reduce(
  (sum, item) => sum + Number(item.TotalArea || 0),
  0,
);

const totalCompleted = workDetails.reduce(
  (sum, item) => sum + Number(item.CompletedArea || 0),
  0,
);

const overallPercentage = totalArea
  ? Math.round((totalCompleted / totalArea) * 100)
  : 0;
 return (
   <motion.div
     initial={{ opacity: 0, y: 10 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.3 }}
   >
     <div className="ps-container">
       <h4 className="ps-title">
       Project Status : <span className="ps-title-highlight">{overallPercentage}% Completed</span>
     </h4>
     
       <div className="ps-grid">
         {workDetails.map((data, index) => {
           const percentage = data.TotalArea
             ? Math.round((data.CompletedArea / data.TotalArea) * 100)
             : 0;

           return (
             <div key={index} className="ps-card">
               <h5 className="ps-work-title">{data.WorkName}</h5>

               <div className="ps-info-row">
                 <span>Total: {data.TotalArea} sq.ft</span>
                 <span>Completed: {data.CompletedArea} sq.ft</span>
               </div>

               <div className="ps-progress-header">
                 <span>Progress</span>
                 <span className="ps-progress-percent">{percentage}%</span>
               </div>

               <div className="ps-progress-bar">
                 <div
                   className="ps-progress-fill"
                   style={{ width: `${percentage}%` }}
                 ></div>
               </div>
             </div>
           );
         })}
       </div>
     </div>
   </motion.div>
 );
}
