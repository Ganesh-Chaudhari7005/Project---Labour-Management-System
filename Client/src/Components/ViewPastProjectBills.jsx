import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { ApiRoute } from "./ApiConfig";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import {BASE_URL} from "./BaseUrl.js";
export default function ViewPastProjectBills() {
  const { id } = useParams();
  console.log(id);
  const [AllBills, setBills] = useState([]);

  const reqPastBills = async () => {
    let reqBills = await fetch(`${ApiRoute}get-past-bills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    let res = await reqBills.json();
    console.log(res);

    if(res.success){
        setBills(res.Bills);
    }
    
  };

  useEffect(() => {
    reqPastBills();
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />

      <div className="container">
        <h3>Past Bills</h3>
        <br />
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="tbl-head">Bill Number</th>
                <th className="tbl-head">Bill Date</th>
                <th className="tbl-head">Total Amount</th>
                <th className="tbl-head">Bill Status</th>
                <th className="tbl-head">View Bill</th>
              </tr>
            </thead>
            <tbody>
              {AllBills.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No bills generated yet
                  </td>
                </tr>
              ) : (
                AllBills.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>{data.BillNo}</td>
                      <td>
                        {new Date(data.billdate).toLocaleDateString("en-GB")}
                      </td>
                      <td>₹ {Math.round(data.TotalAmount)}</td>
                      <td>{data.Status}</td>
                      <td>
                        <a
                          href={`${BASE_URL}${data.PDFPath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Bill
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
