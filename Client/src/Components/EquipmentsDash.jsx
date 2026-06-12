import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ApiRoute } from "./ApiConfig.js";

export default function EquipmentsDash() {
  const [fetchedEquip, setfetchedEquip] = useState([]);

  async function getAllEquipments() {
    try {
      let reqEquip = await fetch(`${ApiRoute}get-inStock-equipList`, {
        method: "GET",
      });

      let res = await reqEquip.json();

      setfetchedEquip(res.allEquipments);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getAllEquipments();
  }, []);

  return (
    <motion.div
      className="equipments-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container py-4">
        {/* Top Header */}
        <div className="equip-header-card">
          <div className="equip-header-left">
            <div className="equip-badge">
              <i className="ri-tools-line"></i>
              Equipment Overview
            </div>

            <h1>Equipment Dashboard</h1>

            <p>
              Monitor available equipment stock, quantity and inventory records
              across all projects.
            </p>
          </div>

          <div className="equip-stat-card">
            <span>Total Equipments</span>

            <h2>{fetchedEquip.length}</h2>
          </div>

          {/* Decorative Circles */}
          <div className="equip-bg-circle one"></div>
          <div className="equip-bg-circle two"></div>
        </div>

        {/* Table Card */}
        <div className="equip-table-card">
          <div className="equip-table-top">
            <div>
              <h3>All Equipments</h3>
              <p>Current in-stock equipment inventory</p>
            </div>

            <div className="table-status">
              <span className="status-dot"></span>
              Quantity
            </div>
          </div>

          <div className="table-responsive">
            <table className="equip-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Equipment Name</th>
                  <th>Total Quantity</th>
                </tr>
              </thead>

              <tbody>
                {fetchedEquip.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <div className="serial-circle">{index + 1}</div>
                    </td>

                    <td>
                      <div className="equip-name">
                        

                        <span>{data.Equipment_Name}</span>
                      </div>
                    </td>

                    <td>
                      <div className="qty-pill">
                        {data.Total_Quantity} Units
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {fetchedEquip.length === 0 && (
              <div className="empty-equip">
                <i className="ri-inbox-line"></i>

                <h4>No Equipments Found</h4>

                <p>Equipment inventory data will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
