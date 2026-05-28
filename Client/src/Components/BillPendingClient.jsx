import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { useApi } from "./ApiCaller";
import { ApiRoute } from './ApiConfig';
import { BASE_URL } from './BaseUrl';
import handlePayment from "./RazorpayTest"; 
import { FaDownload } from "react-icons/fa";
export default function BillPendingClient() {
    const [pendingBills , setPendingBills] = useState([]);
    const callApi = useApi();
    const [showPDF, setShowPDF] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");

    const ClientID = sessionStorage.getItem('ClientID');
    console.log(ClientID);
    
    const getPendingBill = async()=>{
        const reqDet = await callApi(`${ApiRoute}getPendingBill`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ClientID}),
        });
      
      if (reqDet.success) {
        console.log(reqDet);
        
        setPendingBills(reqDet.Bills);
        
      } else {
        console.log("No pending Bills");
      }
        
        
    }

    useEffect(()=>{
     getPendingBill(); 
    },[]);

    useEffect(()=>{
      console.log(pendingBills);
    },[pendingBills])
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ padding: "10px" }}
    >
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center tbl-head">Sr. No.</th>
              <th className='tbl-head'>Project Name</th>
              <th className='tbl-head'>Bill No</th>
              <th className='tbl-head'>Bill Date</th>
              <th className='tbl-head'>Total Amount</th>
              <th className='tbl-head'>Status</th>
              <th className='tbl-head'>Bill</th>
              <th className='tbl-head'>Pay Bill</th>
            </tr>
          </thead>

          <tbody>
            {pendingBills.map((bill, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td>{bill.ProjectName}</td>
                <td>{bill.BillNo}</td>
                <td>
                  {new Date(bill.billdate).toLocaleDateString("en-GB")}
                </td>{" "}
                <td>₹ {bill.TotalAmount}</td>
                <td>
                  <span className="pendingBillsStatusBadge">{bill.Status}</span>
                </td>
                <td>
                  <button
                  style={{marginRight : "15px"}}
                    className="pendingBillsViewBtn"
                    onClick={() => {
                      setPdfUrl(`${BASE_URL}${bill.PDFPath}#toolbar=0`);

                      setShowPDF(true);
                    }}
                  >
                    View Bill
                  </button>
                  <FaDownload
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      try {
                        const response = await fetch(
                          `${BASE_URL}${bill.PDFPath}`,
                        );

                        const blob = await response.blob();

                        const url = window.URL.createObjectURL(blob);

                        const link = document.createElement("a");

                        link.href = url;

                        link.download = `Bill-${bill.BillNo}.pdf`;

                        document.body.appendChild(link);

                        link.click();

                        link.remove();

                        window.URL.revokeObjectURL(url);
                      } catch (err) {
                        console.log(err);

                        toast.error("Failed to download bill");
                      }
                    }}
                  />
                </td>
             
                <td>
                  <td>
                    <button
                      onClick={() => handlePayment(bill)}
                      className="pendingBillsDownloadBtn"
                    >
                      Pay Now
                    </button>
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="bill-table-wrapper">
        <div className="table-topbar">
          <div>
            <h2>Your Pending Bills</h2>
            <p>Pay the bills earlier</p>
          </div>

          <div className="item-count">{pendingBills.length} Items</div>
        </div>
        <div className="custom-table">
          <div className="custom-table-header">
            <div className="col sr">Sr. No.</div>
            <div className="col">Project Name</div>
            <div className="col">BillNo</div>
            <div className="col">Bill Date</div>
            <div className="col">Total Amount</div>
            <div className="col">Status</div>
            <div className="col action-col">View Bill</div>
          </div>
        </div>
      </div> */}

      {showPDF && (
        <div className="pdf-popup-overlay">
          <div className="pdf-popup-container">
            <div className="pdf-popup-header">
              <h4>Invoice Preview</h4>

              <button
                className="pdf-close-btn"
                onClick={() => {
                  setShowPDF(false);
                  setPdfUrl("");
                }}
              >
                ✕
              </button>
            </div>

            <iframe
              src={pdfUrl}
              title="Invoice PDF"
              className="pdf-frame"
            ></iframe>
          </div>
        </div>
      )}
    </motion.div>
  );
}
