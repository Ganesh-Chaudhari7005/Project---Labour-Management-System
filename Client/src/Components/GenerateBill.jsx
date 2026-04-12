import React, { useEffect, useState, useRef } from "react";
import { ApiRoute } from "./ApiConfig";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer , toast} from "react-toastify";

export default function GenerateBill() {
  const { id } = useParams();
  const invoiceRef = useRef();
  const isSubmitting = useRef(false);
  const [workDetails, setWorkDetails] = useState([]);
const [loading, setLoading] = useState(false);
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
  };

  useEffect(() => {
    fetchStatus();
  }, []);

    useEffect(() => {
      console.log(workDetails);
      
    }, [workDetails]);


const handleRateChange = (index, value) => {
  const updated = [...workDetails];
  updated[index].Rate = Number(value); 
  setWorkDetails(updated);
};

const handleSelect = (index) => {
  const updated = [...workDetails];

  if (Number(updated[index].CompletedArea) === 0) return;

  updated[index].selected = !updated[index].selected;
  setWorkDetails(updated);
};
const subtotal = workDetails
  .filter((item) => item.selected)
  .reduce((sum, item) => {
    return sum + Number(item.CompletedArea) * item.Rate;
  }, 0);
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

const validateBill = () => {
  const selectedItems = workDetails.filter((item) => item.selected);

  if (selectedItems.length === 0) {
    toast.error("Please select at least one work item");
    return false;
  }

  for (let item of selectedItems) {
    if (!item.Rate || item.Rate <= 0) {
      toast.error(`Enter valid rate for "${item.WorkName}"`);
      return false;
    }

    if (!item.CompletedArea || item.CompletedArea <= 0) {
      toast.error(`Invalid area for "${item.WorkName}"`);
      return false;
    }
  }

  if (subtotal <= 0) {
    toast.error("Subtotal must be greater than 0");
    return false;
  }

  return true;
};
const generatePDFBlob = async () => {
  const element = invoiceRef.current;

  element.classList.add("pdf-mode");

  const hiddenElements = document.querySelectorAll(".no-print, .hide-in-pdf");
  hiddenElements.forEach((el) => (el.style.display = "none"));

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const margin = 10;
  const imgWidth = 210 - margin * 2;
  const pageHeight = 295;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // 👉 download (optional)
  pdf.save("Invoice.pdf");

  // 👉 convert to blob
  const pdfBlob = pdf.output("blob");

  // restore UI
  hiddenElements.forEach((el) => (el.style.display = ""));
  element.classList.remove("pdf-mode");

  return pdfBlob;
};

const saveBill = async (pdfBlob) => {
  const selectedItems = workDetails
    .filter((item) => item.selected)
    .map((item) => ({
      name: item.WorkName,
      area: Number(item.CompletedArea),
      rate: item.Rate,
      total: Number(item.CompletedArea) * item.Rate,
    }));

  if (selectedItems.length === 0) {
    alert("Select at least one row");
    return;
  }

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);

  const formData = new FormData();

  // 👇 append file
  formData.append("pdf", pdfBlob, "Invoice.pdf");

  // 👇 append other data
  formData.append(
    "data",
    JSON.stringify({
      projectId: id,
      totalAmount,
      details: selectedItems,
    }),
  );

  const res = await fetch(`${ApiRoute}create-bill`, {
    method: "POST",
    body: formData, // ❗ no JSON headers
  });

  const data = await res.json();
  console.log(data);
};
const isValid = workDetails.some(
  (item) => item.selected && item.Rate > 0 && item.CompletedArea > 0,
);
return (
  <motion.div
    ref={invoiceRef}
    className="invoice"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <ToastContainer
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
    />
    <div className="top-bar">
      <div>
        <h2>Royal Enterprises</h2>
        <p>Dhayari, Pune</p>
      </div>

      <div className="invoice-meta">
        <p>
          <strong>Bill No. :</strong> 1
        </p>
        <p>
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>

    <div className="client-section">
      <div>
        <p className="label">Bill To:</p>
        <p>Client Name</p>
        <p>Site Location</p>
      </div>
    </div>

    <table className="invoice-table">
      <thead>
        <tr>
          <th className="no-print">Select</th>
          <th>Sr. No.</th>
          <th>Description</th>
          <th>Area</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {workDetails.map((item, index) => {
          const area = Number(item.CompletedArea);
          const total = area * item.Rate;

          return (
            <tr
              key={index}
              className={!item.selected ? "hide-in-pdf" : ""}
              style={{
                opacity: area === 0 ? 0.5 : 1,
                backgroundColor: area === 0 ? "#f5f5f5" : "white",
              }}
            >
              <td className="no-print">
                <input
                  type="checkbox"
                  checked={item.selected}
                  disabled={area === 0}
                  onChange={() => handleSelect(index)}
                />
              </td>

              <td>{index + 1}</td>
              <td>{item.WorkName}</td>
              <td>{area} sq.ft</td>

              <td>
                <input
                  type="number"
                  value={item.Rate}
                  disabled={area === 0}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value < 0) return;

                    handleRateChange(index, value);
                  }}
                  style={{ width: "80px" }}
                />
              </td>

              <td>{area === 0 ? "—" : `₹ ${total.toLocaleString("en-IN")}`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>

    <div className="totals-section mt-5">
      <div className="totals-box">
        <div>
          <span>Subtotal</span>
          <span>₹ {subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div>
          <span>GST (18%)</span>
          <span>₹ {gst.toFixed(2)}</span>
        </div>

        <div className="grand-total">
          <span>Grand Total</span>
          <span>₹ {grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    <div className="signature mb-5">
      <div>
        <p>For Royal Enterprises</p>
      </div>
    </div>
    <div style={{ textAlign: "right", marginTop: "20px" }}>
      <div className="d-flex align-content-center mb-4">
        <input type="checkbox" name="sendClient" className="mx-3" />
        <label htmlFor="sendClient">Send to client</label>
      </div>
      <button
        className="w-100 cust-prj-btn"
        disabled={loading || !isValid}
        onClick={async () => {
          console.log("Button clicked");
          
          if (isSubmitting.current) return; // 🔥 instant block

          if (!validateBill()) return;

          isSubmitting.current = true;
          setLoading(true);

          try {
            const pdfBlob = await generatePDFBlob();
            await saveBill(pdfBlob);
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
  </motion.div>
);
}
