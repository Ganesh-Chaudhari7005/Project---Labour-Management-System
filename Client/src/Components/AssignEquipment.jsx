import { use, useState } from "react";
import {ApiRoute} from "./ApiConfig.js";
import { useEffect } from "react";
export default function AssignEquipment() {
  const [selectedLabour, setSelectedLabour] = useState("");
  const [selectedEquip, setSelectedEquip] = useState("");
  const [dbAllLab, setAllLab] = useState([])
  const [dbAllEquip, setAllEquip] = useState([])
  const [quantity, setQuantity] = useState(0);

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
    console.log(res);
    
    }catch(err){
      console.log(err);
    }
  }

  const equip = dbAllEquip.find((item)=> item.Equipment_ID === selectedEquip);

  const AvailableQuantity = equip ? equip.Total_Quantity - equip.Assigned_Quantity : 0

  useEffect(()=>{
      getLabour_Equipment_List();
  }, [])

  useEffect(()=>{
    getSelectedLabEquipDet();
  },[selectedLabour])
  return (
    <div className="eq-assign-container p-2 py-4">
      <div className="eq-assign-card">
        <div className="eq-assign-header">
          <h2>Assign Equipment</h2>
          <p>Assign tools to labours and track usage</p>
        </div>

        <div className="eq-assign-content">
          <form className="eq-assign-form">
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
                  <label>Quantity to Assign</label>
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
              <button type="button" className="eq-assign-btn">
                Assign Equipment
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
                      (item) => item.Equipment_ID === selectedEquip
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

                <div className="eq-assign-tip">
                  Tip : Only available Equipments can be assigned.
                </div>
              </div>
            </div>
          </form>
          <br />
          <div className="container">
            <div className="table-responsive table-wrapper">
              <table className="table cust-table">
                <thead>
                  <tr>
                    <th className="tbl-head">Sr. No.</th>
                    <th className="tbl-head">Labour Name</th>
                    <th className="tbl-head">Assigned Equipments</th>
                    <th className="tbl-head">Quantity</th>
                    <th className="tbl-head">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{dbAllLab.find((item)=>item.ID === selectedLabour)?.Name || "Not Selected"}</td>
                  </tr>
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
  );
}
