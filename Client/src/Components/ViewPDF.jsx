import { useLocation } from "react-router-dom";

export default function ViewPDF() {
  const location = useLocation();

  const pdfUrl = location.state?.pdfUrl;

  if (!pdfUrl) {
    return <h3>PDF not found</h3>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "#f5f5f5",
      }}
    >
      <iframe
        src={pdfUrl}
        title="Invoice PDF"
        width="100%"
        height="100%"
        style={{
          border: "none",
        }}
      />
    </div>
  );
}
