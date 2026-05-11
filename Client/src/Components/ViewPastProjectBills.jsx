import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { ApiRoute } from "./ApiConfig";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "./BaseUrl.js";

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

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="tbl-head">Bill Number</th>
                <th className="tbl-head">Bill Date</th>
                <th className="tbl-head">Total Amount</th>
                <th className="tbl-head">Bill Status</th>
                <th className="tbl-head">View</th>
                <th className="tbl-head">Download</th>
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

                      <td>{data.Status}</td>

                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setPdfUrl(`${BASE_URL}${data.PDFPath}#toolbar=0`);

                            setShowPDF(true);
                          }}
                        >
                          View Bill
                        </button>
                      </td>
                      <td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
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
                          >
                            Download
                          </button>
                        </td>
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
