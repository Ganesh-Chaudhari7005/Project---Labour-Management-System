import React, { useEffect, useState, useRef } from "react";
import { ApiRoute } from "./ApiConfig";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function GenerateBill() {
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [pastBillDet, setPastDet] = useState([]);
  const isSubmitting = useRef(false);
  const [workDetails, setWorkDetails] = useState([]);
  const [clientName, setclientName] = useState("");
  const [siteAddr, setsiteAddr] = useState("");
  const [billno, setbillno] = useState();
  const [loading, setLoading] = useState(false);
  const [dup, setdup] = useState([]);
  const [sendToClient, setSendtoClient] = useState(false);
  const[rows, setRows] = useState([])  
  const fetchStatus = async () => {
    const req = await fetch(`${ApiRoute}get-project-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });


    const res = await req.json();

    const updated = res.map((item) => ({
      ...item,
      Rate: item.Rate || 0,
      selected: false,
    }));
    setWorkDetails(updated);
    GetPendingBillInfo(updated);
  };

  const getClientDet_BillNo = async () => {
    let CB = await fetch(`${ApiRoute}get-ClientInfo-BillNo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectid: id }),
    });

    let data = await CB.json();
    console.log(data);
    
    if (data.success) {
      setbillno(data.BillNum);
      setclientName(data.Name);
      setsiteAddr(data.Address);
    }
  };

  useEffect(() => {
    getClientDet_BillNo();
  }, []);
  const GetPendingBillInfo = async (data) => {
    let workArray = data
      .filter((d) => d.CompletedArea > 0)
      .map((d) => d.WorkName);

    console.log(workArray);

    let reqPastbills = await fetch(`${ApiRoute}getPastBill-details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ works: workArray, projectID: id }),
    });

    let res = await reqPastbills.json();
    console.log(res);

    if (res.success) {
      setPastDet(res.data);

      const tempArray = res.data.filter(
        (value) => getTotalArea(value.WorkType) - value.billedArea > 0,
      );

      setdup(tempArray);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (workDetails.length > 0) {
      GetPendingBillInfo(workDetails);
    }
  }, [workDetails]);

  useEffect(() => {
    console.log(workDetails);
  }, [workDetails]);


  const getTotalArea = (WorkName) => {
    const work = workDetails.find((item) => item.WorkName === WorkName);
    return work ? Number(work.CompletedArea) : 0;
  };

  const getRate = (WorkName) => {
    const work = workDetails.find((item) => item.WorkName === WorkName);
    return work ? Number(work.Rate) : 0;
  };
const customSubtotal = rows.reduce((sum, row) => {
  return sum + (Number(row.Area) * Number(row.Rate) || 0);
}, 0);

const subtotal =
  dup.reduce((sum, item) => {
    const area = getTotalArea(item.WorkType) - (item.billedArea || 0);
    const rate = getRate(item.WorkType);
    return sum + area * rate;
  }, 0) + customSubtotal;

  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

 const validateBill = () => {
   if (dup.length === 0) {
     toast.error("No valid work items to bill");
     return false;
   }

   for (let item of dup) {
     const area = getTotalArea(item.WorkType) - (item.billedArea || 0);
     const rate = getRate(item.WorkType);

     if (!rate || rate <= 0) {
       toast.error(`Enter valid rate for "${item.WorkType}"`);
       return false;
     }

     if (!area || area <= 0) {
       toast.error(`Invalid area for "${item.WorkType}"`);
       return false;
     }
   }

   return true;
 };


const selectedItems = dup.map((item) => {
  const totalArea = getTotalArea(item.WorkType);
  const billedArea = Number(item.billedArea || 0);
  const area = Math.max(0, totalArea - billedArea);
  const rate = getRate(item.WorkType);

  return {
    name: item.WorkType,
    area,
    rate,
    total: area * rate,
  };
});
const isValid =
  dup.length > 0 &&
  dup.some((item) => {
    const area = getTotalArea(item.WorkType) - (item.billedArea || 0);
    const rate = getRate(item.WorkType);
    return area > 0 && rate > 0;
  });
  const getRemainingArea = (workType) => {
    const total = getTotalArea(workType);

    const billed =
      pastBillDet.find((i) => i.WorkType === workType)?.billedArea || 0;

    return Math.max(0, total - billed);
  };

const removeRow = (index) => {
  const updatedRows = dup.filter((value, i) => i !== index);
  setdup(updatedRows);
};


const createBill = async () => {
  try {
    const response = await fetch(`${ApiRoute}create-bill`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        projectId: id,

        billno,

        clientName,

        siteAddr,

        subtotal,

        gst,

        grandTotal,

        totalAmount: grandTotal,

        items: selectedItems,

        sendToClient,

        customRows: rows,

        details: [
          ...selectedItems,

          ...rows.map((row) => ({
            name: row.Desc,
            area: Number(row.Area),
            rate: Number(row.Rate),
            total: Number(row.Area) * Number(row.Rate),
          })),
        ],
      }),
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Bill Generated Successfully");
      fetchStatus();
     if (data.filePath) {
       try {
         const response = await fetch(`${ApiRoute}${data.filePath}`);

         const blob = await response.blob();

         const url = window.URL.createObjectURL(blob);

         const link = document.createElement("a");

         link.href = url;

         link.download = `bill${billno || "Invoice"}.pdf`;

         document.body.appendChild(link);

         link.click();

         link.remove();

         window.URL.revokeObjectURL(url);
       } catch (err) {
         console.log(err);

         toast.error("Failed to download PDF");
       }
     }
    } else {
      toast.error("Failed to generate bill");
    }
  } catch (err) {
    console.log(err);

    toast.error("Something went wrong");
  }
};



  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ToastContainer
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />

      <div className="invoice-client-section">
        <div className="invoice-client-card">
          {/* Left Decorative Blur */}
          <div className="invoice-bg-circle one"></div>
          <div className="invoice-bg-circle two"></div>

          {/* Left Side */}
          <div className="invoice-client-left">
            <div className="section-tag">Billing Details</div>

            <div className="client-info-block">
              <span className="info-label">Bill To</span>

              <h2 className="client-name">{clientName || "Client Name"}</h2>
            </div>

            <div className="client-info-block">
              <span className="info-label">Billing Address</span>

              <p className="client-address">{siteAddr || "Site Address"}</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="invoice-client-right">
            <div className="invoice-info-card">
              <span className="invoice-label">Invoice No</span>

              <h3 className="invoice-value">#{billno || "0001"}</h3>
            </div>

            <div className="invoice-info-card">
              <span className="invoice-label">Issue Date</span>

              <h3 className="invoice-value">
                {new Date().toLocaleDateString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bill-table-wrapper">
        <div className="table-topbar">
          <div>
            <h2>Billing Items</h2>
            <p>Manage work entries and custom charges</p>
          </div>

          <div className="item-count">{dup.length + rows.length} Items</div>
        </div>

        <div className="custom-table">
          {/* Header */}
          <div className="custom-table-header">
            <div className="col sr">#</div>
            <div className="col desc">Description</div>
            <div className="col">Area</div>
            <div className="col">Rate</div>
            <div className="col">Amount</div>
            <div className="col action-col">Action</div>
          </div>

          {/* Body */}
          <div className="custom-table-body">
            {dup.map((item, index) => {
              const area = Number(item.CompletedArea);

              return (
                <div
                  key={index}
                  className="custom-table-row existing-row"
                  style={{
                    opacity: area === 0 ? 0.55 : 1,
                  }}
                >
                  <div className="col sr">
                    <span className="serial-badge">{index + 1}</span>
                  </div>

                  <div className="col desc">
                    <div className="work-type">
                      <span>{item.WorkType}</span>
                    </div>
                  </div>

                  <div className="col">
                    <span className="table-pill">
                      {getTotalArea(item.WorkType) - item.billedArea} sq.ft
                    </span>
                  </div>

                  <div className="col">₹ {getRate(item.WorkType)}</div>

                  <div className="col amt-text">
                    ₹
                    {(
                      (getTotalArea(item.WorkType) - item.billedArea) *
                      getRate(item.WorkType)
                    ).toLocaleString("en-IN")}
                  </div>

                  <div className="col action-col">
                    <button
                      className="bill-remove"
                      onClick={() => removeRow(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            {rows.map((row, index) => (
              <div
                key={`custom-${index}`}
                className="custom-table-row custom-entry-row"
              >
                <div className="col sr">
                  <span className="serial-badge">{dup.length + index + 1}</span>
                </div>

                <div className="col desc">
                  <input
                    className="cust-bill-inp"
                    value={row.Desc}
                    onChange={(e) => {
                      const updated = [...rows];
                      updated[index].Desc = e.target.value;
                      setRows(updated);
                    }}
                    placeholder="Enter description"
                  />
                </div>

                <div className="col">
                  <input
                    className="cust-bill-inp"
                    type="number"
                    value={row.Area}
                    onChange={(e) => {
                      const updated = [...rows];
                      updated[index].Area = e.target.value;
                      setRows(updated);
                    }}
                    placeholder="Area"
                  />
                </div>

                <div className="col">
                  <input
                    className="cust-bill-inp"
                    type="number"
                    value={row.Rate}
                    onChange={(e) => {
                      const updated = [...rows];
                      updated[index].Rate = e.target.value;
                      setRows(updated);
                    }}
                    placeholder="Rate"
                  />
                </div>

                <div className="col amt-text">
                  ₹ {(row.Area * row.Rate || 0).toLocaleString("en-IN")}
                </div>

                <div className="col action-col">
                  <button
                    className="bill-remove"
                    onClick={() => {
                      const updated = rows.filter((_, i) => i !== index);
                      setRows(updated);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Enhanced Billing Summary */}
      <div className="billing-summary-wrapper mt-5">
        <div className="billing-summary-card">
          <div className="summary-header">
            <div>
              <h2>Bill Summary</h2>
              <p>Detailed billing breakdown</p>
            </div>

            <div className="summary-badge">
              <span>GST 18%</span>
            </div>
          </div>

          <div className="summary-body">
            <div className="summary-row">
              <div className="summary-left">
                <span className="summary-title">Subtotal</span>
                <span className="summary-sub">
                  Total before tax calculation
                </span>
              </div>

              <div className="summary-right">
                ₹ {subtotal.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="summary-row gst-row">
              <div className="summary-left">
                <span className="summary-title">GST Charges</span>
                <span className="summary-sub">18% Government Tax</span>
              </div>

              <div className="summary-right gst-text">
                + ₹ {gst.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <div>
                <span className="grand-label">Grand Total</span>
                <p className="grand-sub">Final payable amount</p>
              </div>

              <div className="grand-amount">
                ₹ {grandTotal.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right", marginTop: "20px" }}>
        <div className="d-flex align-content-center mb-4">
          <input type="checkbox"
           name="sendClient" 
           checked={sendToClient}
           onChange={()=>setSendtoClient((prev)=>!prev)}
           className="mx-3" />
          <label htmlFor="sendClient">Send to client</label>
        </div>
        <button
          className="w-100 cust-prj-btn"
          disabled={loading || !isValid}
          onClick={async () => {
            console.log("Button clicked");

            if (isSubmitting.current) return;

            if (!validateBill()) return;

            isSubmitting.current = true;
            setLoading(true);

            try {
              await createBill();
            } catch (err) {
              console.log(err);
            } finally {
              setLoading(false);
              isSubmitting.current = false;
            }
          }}
        >
          {loading ? "Generating..." : "Generate Bill"}
        </button>
      </div>
      {showPDF && (
        <div className="pdf-popup-overlay">
          <div className="pdf-popup-container">
            <div className="pdf-popup-header">
              <h4>Invoice Preview</h4>

              <button
                className="pdf-close-btn"
                onClick={() => setShowPDF(false)}
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
