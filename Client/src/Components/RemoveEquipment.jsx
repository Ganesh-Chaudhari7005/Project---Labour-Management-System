
import React, { useState, useEffect } from "react";
import { ApiRoute } from "./ApiConfig.js";
import { useApi } from "./ApiCaller.js";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

export default function RemoveEquipment() {
  const callApi = useApi();
  const [selectedEquip, setSelectedEquip] = useState("");
  const [fetchedEquip, setfetchedEquip] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState();
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


  const handleSubmit = async(e)=>{
    e.preventDefault();      
     try{
        let reqEquipUpdate = await callApi(`${ApiRoute}remove-equipments`, {
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({selectedEquip, selectedQuantity})
        })
        
        if (reqEquipUpdate.success) {
            toast.success(reqEquipUpdate.message);
            console.log(reqEquipUpdate.message);
             setSelectedEquip("");
             setSelectedQuantity(0);
             getAllEquipments();
        }else{
          toast.error(reqEquipUpdate.message);
                      console.log(reqEquipUpdate.message);

        }
     }catch(err){
      console.log(err);
      
     }
     
  }
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
      <div className="eq-add-container py-2">
        <div className="eq-add-card">
          <div className="eq-add-header">
            <h2>Remove Equipment</h2>
            {/* <p>Remove equipments</p> */}
          </div>

          <div className="eq-add-content">
            <form className="eq-add-form" onSubmit={(e) => handleSubmit(e)}>
              <div className="eq-add-form-group">
                <label>Select Equipment (Optional)</label>
                <select
                  value={selectedEquip}
                  onChange={(e) => {
                    setSelectedEquip(e.target.value);
                  }}
                >
                  <option value="">-- Select Equipment --</option>
                  {fetchedEquip.map((data, index) => {
                    return (
                      <option key={index} value={data?.Equipment_ID || ""}>
                        {data?.Equipment_Name || "Loading"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="eq-add-form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(e.target.value)}
                />
              </div>

              <div className="eq-add-button-row">
                <button type="submit" className="eq-add-btn eq-add-primary">
                  Remove Equipment
                </button>
              </div>
            </form>

            <div className="eq-add-summary">
              <h3>Summary</h3>

              <div className="eq-add-summary-box">
                <span>Equipment</span>
                <strong>
                  {fetchedEquip.find(
                    (item) => item.Equipment_ID === selectedEquip,
                  )?.Equipment_Name || "Not Selected"}
                </strong>
              </div>
              <div className="eq-add-summary-box">
                <span>Current Stock</span>
                <strong>
                  {
                    fetchedEquip.find(
                      (item) => item.Equipment_ID === selectedEquip,
                    )?.Total_Quantity || "-"
                  }
                </strong>
              </div>
              <div className="eq-add-summary-box">
                <span>Remove Qty</span>
                <strong>{selectedQuantity ? selectedQuantity : "-"}</strong>
              </div>
              <div className="eq-add-summary-box">
                <span>Qty. After Removal</span>
                <strong>
                  {
                    fetchedEquip.find(
                      (item) => item.Equipment_ID === selectedEquip,
                    )?.Total_Quantity - selectedQuantity || "-"
                  }
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
