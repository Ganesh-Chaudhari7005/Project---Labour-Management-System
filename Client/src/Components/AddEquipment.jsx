import React, { useState, useEffect } from "react";
import { ApiRoute } from "./ApiConfig.js";
import { useApi } from "./ApiCaller.js";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";

export default function AddEquipment() {
  const callApi = useApi();
  const [selectedEquip, setSelectedEquip] = useState("");
  const [fetchedEquip, setfetchedEquip] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [otherEquip, setOtherEquip] = useState("");
  async function getAllEquipments() {
  try{
      let reqEquip = await fetch(`${ApiRoute}get-all-equipments-list`, {
      method: "GET",
    });
    let res = await reqEquip.json();
    setfetchedEquip(res);
    console.log(res);
    
  }catch(err){
    console.log(err);
  }
    
  }

  useEffect(() => {
    getAllEquipments();
  }, []);


  const handleSubmit = async(e)=>{
    e.preventDefault();
     const finalEquipment = otherEquip || selectedEquip;
     console.log(finalEquipment);
      
     try{
        let reqEquipUpdate = await callApi(`${ApiRoute}add-equipments`, {
          method : "POST",
          headers : {
            "Content-Type" : "application/json"
          },
          body : JSON.stringify({finalEquipment, selectedQuantity})
        })
        
        if (reqEquipUpdate.success) {
            toast.success(reqEquipUpdate.message);
            console.log(reqEquipUpdate.message);
             setSelectedEquip("");
             setOtherEquip("");
             setSelectedQuantity(0);
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
      <div className="eq-add-container">
        <div className="eq-add-card">
          <div className="eq-add-header">
            <h2>Add Equipment</h2>
            <p>Add purchased tools to your inventory</p>
          </div>

          <div className="eq-add-content">
            <form className="eq-add-form" onSubmit={(e) => handleSubmit(e)}>
              <div className="eq-add-form-group">
                <label>Select Equipment (Optional)</label>
                <select
                  value={selectedEquip}
                  onChange={(e) => {
                    setSelectedEquip(e.target.value);
                    setOtherEquip("");
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
                <label>Or Enter Other Equipment</label>
                <input
                  type="text"
                  value={otherEquip}
                  onChange={(e) => {
                    setOtherEquip(e.target.value);
                    setSelectedEquip("");
                  }}
                />
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
              <div className="eq-add-tip">
                Tip: Quantity should match the actual purchased quantity.
              </div>
              <div className="eq-add-button-row">
                <button type="submit" className="eq-add-btn eq-add-primary">
                  Add Equipment
                </button>
              </div>
            </form>

            <div className="eq-add-summary">
              <h3>Summary</h3>

              <div className="eq-add-summary-box">
                <span>Equipment</span>
                <strong>
                  {otherEquip ||
                    fetchedEquip.find(
                      (item) => item.Equipment_ID === selectedEquip,
                    )?.Equipment_Name ||
                    "Not Selected"}
                </strong>
              </div>

              <div className="eq-add-summary-box">
                <span>Quantity</span>
                <strong>{selectedQuantity ? selectedQuantity : 0}</strong>
              </div>

              <div className="eq-add-tip">
                Tip: You can select or type new equipment.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
