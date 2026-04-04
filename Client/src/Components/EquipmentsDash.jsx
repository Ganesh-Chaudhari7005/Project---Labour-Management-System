import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ApiRoute } from "./ApiConfig.js";
export default function EquipmentsDash() {
    const [fetchedEquip, setfetchedEquip] = useState([]);
    async function getAllEquipments() {
    try{
        let reqEquip = await fetch(`${ApiRoute}get-inStock-equipList`, {
          method: "GET",
        });
      let res = await reqEquip.json();
  setfetchedEquip(res.allEquipments);
      
    }catch(err){
      console.log(err);
    }
      
    }
  
    useEffect(() => {
      getAllEquipments();
    }, []);
  
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container py-4">
          <h3>All Equipments</h3>
          <div className="table-responsive">
            <table className="table table-bordered cust-table">
              <thead>
                <tr>
                  <th className="tbl-head">Sr. No.</th>
                  <th className="tbl-head">Equipment Name</th>
                  <th className="tbl-head">Total Quantity</th>
                </tr>
              </thead>
              <tbody>
                {fetchedEquip.map((data, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{data.Equipment_Name}</td>
                    <td>{data.Total_Quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
}
