import { useEffect, useState } from "react";
import { ApiRoute } from "./ApiConfig";
import { useParams } from "react-router-dom";

export default function SiteIssueCont() {
  const [activeTab, setActiveTab] = useState("labour");
  const [issues, setIssues] = useState([]);
  const [supIssues, setSupIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientIssues, setClientIssues] = useState([]);
const { id } = useParams();

const fetchClientIssues = async () => {
  try {
    const req = await fetch(`${ApiRoute}get-client-issues/${id}`);

    const res = await req.json();
    console.log(res);
    
    setClientIssues(res);
  } catch (error) {
    console.log(error);
  }finally{
    setLoading(false);
  }
};

const fetchIssues = async () => {
  try {
    setLoading(true);

    const req = await fetch(`${ApiRoute}get-labour-issues/${id}`);
    const res = await req.json();

    console.log(res);

    setIssues(res);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

const fetchSupIssues = async () => {
  try {
    setLoading(true);

    const req = await fetch(`${ApiRoute}get-sup-issues/${id}`);
    const res = await req.json();

    console.log(res);

    setSupIssues(res);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const loadData = async () => {
    setLoading(true);

    await Promise.all([fetchIssues(), fetchClientIssues(), fetchSupIssues()]);

    setLoading(false);
  };

  if (id) {
    loadData();
  }
}, [id]);

return (
  <>
    <div className="container-fluid">
      {/* Tabs */}
      <ul
        className="nav mb-4"
        style={{
          borderBottom: "1px solid #dee2e6",
          gap: "10px",
        }}
      >
        <li className="nav-item">
          <button
            className="btn"
            onClick={() => setActiveTab("labour")}
            style={{
              border: "none",
              borderBottom:
                activeTab === "labour"
                  ? "3px solid #0d6efd"
                  : "3px solid transparent",
              borderRadius: 0,
              fontWeight: activeTab === "labour" ? "600" : "500",
              color: activeTab === "labour" ? "#212529" : "#6c757d",
              padding: "12px 20px",
              background: "transparent",
            }}
          >
            Labour Issues
          </button>
        </li>

        <li className="nav-item">
          <button
            className="btn"
            onClick={() => setActiveTab("client")}
            style={{
              border: "none",
              borderBottom:
                activeTab === "client"
                  ? "3px solid #0d6efd"
                  : "3px solid transparent",
              borderRadius: 0,
              fontWeight: activeTab === "client" ? "600" : "500",
              color: activeTab === "client" ? "#212529" : "#6c757d",
              padding: "12px 20px",
              background: "transparent",
            }}
          >
            Client Issues
          </button>
        </li>

        <li className="nav-item">
          <button
            className="btn"
            onClick={() => setActiveTab("supervisor")}
            style={{
              border: "none",
              borderBottom:
                activeTab === "supervisor"
                  ? "3px solid #0d6efd"
                  : "3px solid transparent",
              borderRadius: 0,
              fontWeight: activeTab === "supervisor" ? "600" : "500",
              color: activeTab === "supervisor" ? "#212529" : "#6c757d",
              padding: "12px 20px",
              background: "transparent",
            }}
          >
            Supervisor Issues
          </button>
        </li>
      </ul>

      {/* Content */}
      <div className="tab-content">
        {activeTab === "labour" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              border: "1px solid #e9ecef",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <h5>Labour Issues</h5>

            {/* Labour table */}
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="tbl-head">Sr. No.</th>
                    <th className="tbl-head">Labour Name</th>
                    <th className="tbl-head">Issue Description</th>
                    <th className="tbl-head">Reported Date & Time</th>
                    <th className="tbl-head">Status</th>
                    <th className="tbl-head">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((data, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data.LabourName}</td>
                      <td>{data.IssueDescription}</td>
                      <td>
                        {new Date(data.CreatedAt).toLocaleString("en-GB")}
                      </td>{" "}
                      <td>{data.Status || "pending"}</td>
                      <td>
                        <button>Update Status</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "client" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              border: "1px solid #e9ecef",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <h5>Client Issues</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="tbl-head">Sr. No.</th>
                    <th className="tbl-head">Client Name</th>
                    <th className="tbl-head">Issue Description</th>
                    <th className="tbl-head">Reported Date & Time</th>
                    <th className="tbl-head">Status</th>
                    <th className="tbl-head">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clientIssues.map((data, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data.ClientName}</td>
                      <td>{data.IssueDescription}</td>
                      <td>
                        {new Date(data.CreatedAt).toLocaleString("en-GB")}
                      </td>{" "}
                      <td>{data.Status || "pending"}</td>
                      <td>
                        <button>Update Status</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Client table */}
          </div>
        )}

        {activeTab === "supervisor" && (
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              border: "1px solid #e9ecef",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <h5>Supervisor Issues</h5>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="tbl-head">Sr. No.</th>
                    <th className="tbl-head">Supervisor Name</th>
                    <th className="tbl-head">Issue Description</th>
                    <th className="tbl-head">Reported Date & Time</th>
                    <th className="tbl-head">Status</th>
                    <th className="tbl-head">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {supIssues.map((data, index) => (
                    <tr>
                      <td>{index + 1}</td>
                      <td>{data.SupervisorName}</td>
                      <td>{data.IssueDescription}</td>
                      <td>
                        {new Date(data.CreatedAt).toLocaleString("en-GB")}
                      </td>{" "}
                      <td>{data.Status || "pending"}</td>
                      <td>
                        <button>Update Status</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Supervisor table */}
          </div>
        )}
      </div>
    </div>
  </>
);
}
