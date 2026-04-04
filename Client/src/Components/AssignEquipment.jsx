import {useState } from "react";
import {ApiRoute} from "./ApiConfig.js";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
export default function AssignEquipment() {
  const [selectedLabour, setSelectedLabour] = useState("");
  const [selectedEquip, setSelectedEquip] = useState("");
  const [dbAllLab, setAllLab] = useState([])
  const [dbAllEquip, setAllEquip] = useState([])
  const [quantity, setQuantity] = useState(0);
  const [isEquipAssigned, setisAssigned] = useState(false);
  const[currentAssignEqip, setcurrenntAssignEquip] = useState([]);
  const[notAssignedMsg, setNotAssignedMsg] = useState("");
  const getLabour_Equipment_List = async()=>{
      let reqInfo = await fetch(`${ApiRoute}get-Lab-Equip-Info`,{
        method : "GET"
      })

      let res = await reqInfo.json();
      console.log(res.allEquipments);
      console.log(res.allLabourList);
      setAllEquip(res.allEquipments);
      setAllLab(res.allLabourList);

      
  }

  const getSelectedLabEquipDet = async()=>{
    try{
      let reqLabEquip = await fetch(`${ApiRoute}Selected-Lab-Equip-Det`,{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({selectedLabour})
    })

    let res = await reqLabEquip.json();
    console.log("selected lab", res);

    if(res.isAssigned){
      setisAssigned(res.isAssigned);
      setcurrenntAssignEquip(res.AssignedEquipments);
    }else{
      setisAssigned(res.isAssigned);
            setcurrenntAssignEquip([]);

      setNotAssignedMsg(res.message);
    }
    
    }catch(err){
      console.log(err);
    }
  }

  const AssignEquipmentHandler = async(e)=>{
    e.preventDefault();
     try {
       let reqAssignEquip = await fetch(`${ApiRoute}assign-equip`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ selectedLabour , selectedEquip, quantity }),
       });

       let res = await reqAssignEquip.json();

       if(res.success){
        toast.success(res.message);
        getSelectedLabEquipDet();
       }else{
        toast.error(res.message);
       }
     } catch (err) {
       console.log(err);
     }
  }

   const UNAssignEquipmentHandler = async (e) => {
     try {
       let reqUnAssignEquip = await fetch(`${ApiRoute}un-assign-equip`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ selectedLabour, selectedEquip, quantity }),
       });

       let res = await reqUnAssignEquip.json();

       if (res.success) {
         toast.success(res.message);
                 getSelectedLabEquipDet();

       } else {
         toast.error(res.message);
       }
     } catch (err) {
       console.log(err);
     }
   };

  const equip = dbAllEquip.find((item)=> item.Equipment_ID === selectedEquip);

  const AvailableQuantity = equip ? equip.Total_Quantity - equip.Assigned_Quantity : 0

  useEffect(()=>{
      getLabour_Equipment_List();
  }, [])

  useEffect(()=>{
    getSelectedLabEquipDet();
  },[selectedLabour])
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
      <div className="eq-assign-container p-2 py-4">
        <div className="eq-assign-card">
          <div className="eq-assign-header">
            <h2>Assign Equipment</h2>
            <p>Assign tools to labours and track usage</p>
          </div>

          <div className="eq-assign-content">
            <form
              onSubmit={(e) => AssignEquipmentHandler(e)}
              className="eq-assign-form"
            >
              <div className="row">
                <div className="col-lg-4">
                  <div className="eq-assign-group">
                    <label>Select Labour</label>
                    <select
                      onChange={(e) => {
                        setSelectedLabour(e.target.value);
                      }}
                    >
                      <option value="">-- Select Labour --</option>
                      {dbAllLab.map((data, index) => (
                        <option key={index} value={data.ID}>
                          {data?.Name || "Loading"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="eq-assign-group">
                    <label>Select Equipment</label>
                    <select
                      onChange={(e) => {
                        setSelectedEquip(e.target.value);
                      }}
                    >
                      <option value="">-- Select Equipment --</option>
                      {dbAllEquip.map((data, index) => (
                        <option key={index} value={data.Equipment_ID}>
                          {data?.Equipment_Name || "Loading"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="eq-assign-group">
                    <label>Quantity </label>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="eq-assign-btn-row">
                <button type="submit" className="eq-assign-btn">
                  Assign Equipment
                </button>
                <button type="button" onClick={()=>UNAssignEquipmentHandler()} className="eq-assign-btn">
                  UnAssign Equipment
                </button>
                <div className="eq-assign-summary">
                  <span>
                    Equipment : {""}
                    {dbAllEquip.find(
                      (item) => item.Equipment_ID === selectedEquip,
                    )?.Equipment_Name || "Not Selected"}
                  </span>

                  <div className="eq-assign-box">
                    <span className="equip-span">Total :</span>
                    <strong>
                      {dbAllEquip.find(
                        (item) => item.Equipment_ID === selectedEquip,
                      )?.Total_Quantity || 0}
                    </strong>
                  </div>

                  <div className="eq-assign-box">
                    <span className="equip-span">Assigned Quantity : </span>
                    <strong>
                      {dbAllEquip.find(
                        (item) => item.Equipment_ID === selectedEquip,
                      )?.Assigned_Quantity || 0}
                    </strong>
                  </div>
                  <div className="eq-assign-box">
                    <span className="equip-span">Available :</span>
                    <strong>{AvailableQuantity}</strong>
                  </div>

                 
                </div>
              </div>
            </form>
            <br />
            <div className="container">
              <div className="table-responsive table-wrapper">
                <table className="table table-bordered cust-table">
                  <thead>
                    <tr>
                      <th className="tbl-head">Sr. No.</th>
                      <th className="tbl-head">Labour Name</th>
                      <th className="tbl-head">Assigned Equipments</th>
                      <th className="tbl-head">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAssignEqip.length > 0 ? (
                      currentAssignEqip.map((data, index) => {
                        const equipName = dbAllEquip.find(
                          (item) => item.Equipment_ID === data.EquipmentID,
                        )?.Equipment_Name;

                        return (
                          <tr key={index}>
                            {index === 0 && (
                              <>
                                <td rowSpan={currentAssignEqip.length}>1</td>

                                <td rowSpan={currentAssignEqip.length}>
                                  {
                                    dbAllLab.find(
                                      (item) => item.ID === selectedLabour,
                                    )?.Name
                                  }
                                </td>
                              </>
                            )}

                            <td>{equipName}</td>

                            <td>{data.Quantity_Assigned}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="5">
                          {notAssignedMsg || "No equipment assigned"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* <div className="eq-assign-summary">
            <h3>
              Equipment : {""}
               {dbAllEquip.find((item) => item.Equipment_ID === selectedEquip)
                ?.Equipment_Name || "Not Selected"}
            </h3>

            <div className="eq-assign-box">
              <span>Total</span>
              <strong>
                {dbAllEquip.find((item) => item.Equipment_ID === selectedEquip)
                  ?.Total_Quantity || 0}
              </strong>
            </div>

            <div className="eq-assign-box">
              <span>Assigned Quantity</span>
              <strong>
                {dbAllEquip.find((item) => item.Equipment_ID === selectedEquip)
                  ?.Assigned_Quantity || 0}
              </strong>
            </div>
            <div className="eq-assign-box">
              <span>Available</span>
              <strong>{AvailableQuantity}</strong>
            </div>

            <div className="eq-assign-tip">
              Only available stock can be assigned.
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
