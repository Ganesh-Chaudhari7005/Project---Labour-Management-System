import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { ApiRoute } from "./ApiConfig";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "./BaseUrl.js";
import { FaDownload } from "react-icons/fa";
import { FaFileDownload } from "react-icons/fa";
<FaDownload />;
export default function ViewPastProjectBills() {
  const { id } = useParams();

  const [AllBills, setBills] = useState([]);

  // ✅ PDF popup states
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const reqPastBills = async () => {
    let reqBills = await fetch(`${ApiRoute}get-past-bills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    let res = await reqBills.json();

    if (res.success) {
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

        <div className="pendingBillsTableWrapper">
          <table className="pendingBillsTable">
            <thead>
              <tr>
                <th className="tbl-head">Bill Number</th>
                <th className="tbl-head">Bill Date</th>
                <th className="tbl-head">Total Amount</th>
                <th className="tbl-head">Bill Status</th>
                <th className="tbl-head">View/Download</th>
                <th className="tbl-head">Receipt</th>
              </tr>
            </thead>

            <tbody>
              {AllBills.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
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

                      <td>
                        <span
                          className={
                            data.Status === "Paid"
                              ? "pendingBillsDownloadBtn"
                              : "pendingBillsStatusBadge"
                          }
                        >
                          {data.Status}
                        </span>
                      </td>

                      <td
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setPdfUrl(`${BASE_URL}${data.PDFPath}#toolbar=0`);

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
                                `${BASE_URL}${data.PDFPath}`,
                              );

                              const blob = await response.blob();

                              const url = window.URL.createObjectURL(blob);

                              const link = document.createElement("a");

                              link.href = url;

                              link.download = `Bill-${data.BillNo}.pdf`;

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
                        {data.PaidBillReceipt != null ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                setPdfUrl(
                                  `${BASE_URL}${data.PaidBillReceipt}#toolbar=0`,
                                );

                                setShowPDF(true);
                              }}
                            >
                              View Receipt
                            </button>
                            <FaDownload
                              style={{ cursor: "pointer" }}
                              onClick={async () => {
                                try {
                                  const response = await fetch(
                                    `${BASE_URL}${data.PaidBillReceipt}`,
                                  );

                                  const blob = await response.blob();

                                  const url = window.URL.createObjectURL(blob);

                                  const link = document.createElement("a");

                                  link.href = url;

                                  link.download = `Bill-${data.BillNo}.pdf`;

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
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ PDF POPUP */}
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
