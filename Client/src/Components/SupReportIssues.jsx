import { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { ApiRoute } from "./ApiConfig.js";
import { ToastContainer, toast } from "react-toastify";
export default function SupReportIssues() {
 const [projectList, setProjectList] = useState([]);
  const [issueFormData, setIssueFormData] = useState({
    project: "",
    description: "",
  });

  const getprojectList = async () => {
    let supID = sessionStorage.getItem("SupId");

    let reqList = await fetch(`${ApiRoute}get-sup-ProjectsList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ supID }),
    });

    let data = await reqList.json();
    console.log(data);
    
    if (data.success) {
      setProjectList(data.ProjectDetails);
    }
  };

  useEffect(() => {
    getprojectList();
  }, []);



  const handleIssueChange = (e) => {
    setIssueFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

 const handleIssueSubmit = async (e) => {
   e.preventDefault();

   try {
     let SupId = sessionStorage.getItem("SupId");

     let req = await fetch(`${ApiRoute}insert-sup-Issue`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         ...issueFormData,
         SupId,
       }),
     });

     let data = await req.json();

     if (data.success) {
       toast.success("Issue Submitted Successfully");

       setIssueFormData({
         project: "",
         description: "",
       });
     } else {
       toast.error(data.message);
     }
   } catch (error) {
     console.log(error);
     alert("Something went wrong");
   }
 };

  return (
    <motion.div
      className="issuepage-wrapper"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <ToastContainer/>
      {/* Header */}
      <div className="project-top-section">
        <div className="project-header-card">
          <div className="project-header-left">
            <div className="project-badge">
              <i className="ri-error-warning-line"></i>
              Report Issues
            </div>
          </div>

          <div className="issuepage-floating-icon">
            <i className="ri-customer-service-2-line"></i>
          </div>

          <div className="project-bg-circle one"></div>
          <div className="project-bg-circle two"></div>
        </div>
      </div>

      {/* Form Card */}
      <motion.form
        className="issueform-card"
        onSubmit={handleIssueSubmit}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Top Info */}
        <div className="issueform-top">
          <div className="issueform-icon-box">
            <i className="ri-error-warning-line"></i>
          </div>

          <div>
            <h3 className="issueform-heading mb-0">Submit Issue</h3>
            <p className="issueform-text mb-0">
              Fill in the details below to report your issue.
            </p>
          </div>
        </div>

        {/* Project Select */}
        <div className="issueform-group">
          <label className="issueform-label">
            <i className="ri-folder-2-line"></i>
            Select Project
          </label>

          <div className="issueform-input-wrapper">
            <select
              className="issueform-input"
              name="project"
              value={issueFormData.project}
              onChange={handleIssueChange}
              required
            >
              <option value="">Choose Project</option>

              {projectList.map((project, index) => (
                <option key={index} value={project.ProjectID}>
                  {project.ProjectName}
                </option>
              ))}
            </select>

            <i className="ri-arrow-down-s-line issueform-input-icon"></i>
          </div>
        </div>

        {/* Description */}
        <div className="issueform-group">
          <label className="issueform-label">
            <i className="ri-chat-3-line"></i>
            Issue Description
          </label>

          <textarea
            className="issueform-textarea"
            name="description"
            rows="7"
            placeholder="Describe the issue in detail..."
            value={issueFormData.description}
            onChange={handleIssueChange}
            required
          ></textarea>

          <span className="issueform-helper-text">
            Add complete details for faster resolution.
          </span>
        </div>

        {/* Submit */}
        <button type="submit" className="issueform-submit-btn">
          <i className="ri-send-plane-fill"></i>
          Submit Issue
        </button>
      </motion.form>

      <style jsx>{`
        .issuepage-wrapper {
          width: 100%;
        }

        .issuepage-title {
          margin-top: 16px;
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
        }

        .issuepage-subtitle {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          max-width: 500px;
          line-height: 1.6;
        }

        .issuepage-floating-icon {
          position: absolute;
          right: 35px;
          top: 50%;
          transform: translateY(-50%);
          width: 90px;
          height: 90px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .issuepage-floating-icon i {
          font-size: 42px;
          color: white;
        }

        .issueform-card {
          margin-top: 24px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 1),
            rgba(248, 250, 255, 1)
          );
          border-radius: 26px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
          overflow: hidden;
        }

        .issueform-card::before {
          content: "";
          position: absolute;
          top: -100px;
          right: -100px;
          width: 220px;
          height: 220px;
          background: rgba(79, 70, 229, 0.05);
          border-radius: 50%;
        }

        .issueform-top {
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          z-index: 2;
        }

        .issueform-icon-box {
          min-width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.25);
        }

        .issueform-icon-box i {
          font-size: 28px;
          color: white;
        }

        .issueform-heading {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }

        .issueform-text {
          margin-top: 4px;
          color: #6b7280;
          font-size: 14px;
        }

        .issueform-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .issueform-label {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .issueform-label i {
          color: #4f46e5;
          font-size: 16px;
        }

        .issueform-input-wrapper {
          position: relative;
        }

        .issueform-input-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: #6b7280;
          pointer-events: none;
        }

        .issueform-input,
        .issueform-textarea {
          width: 100%;
          border: 1px solid #dbe2ea;
          background: white;
          border-radius: 18px;
          padding: 15px 18px;
          font-size: 14px;
          outline: none;
          transition: all 0.25s ease;
          color: #111827;
        }

        .issueform-input {
          appearance: none;
          padding-right: 45px;
          height: 56px;
        }

        .issueform-textarea {
          resize: none;
          min-height: 180px;
          line-height: 1.7;
        }

        .issueform-input:focus,
        .issueform-textarea:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 5px rgba(79, 70, 229, 0.1);
          transform: translateY(-1px);
        }

        .issueform-helper-text {
          font-size: 12px;
          color: #6b7280;
          padding-left: 4px;
        }

        .issueform-submit-btn {
          height: 58px;
          border: none;
          border-radius: 18px;
          background: var(--primary);
          color: white;
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 15px 30px rgba(79, 70, 229, 0.25);
          position: relative;
          z-index: 2;
        }

        .issueform-submit-btn i {
          font-size: 18px;
        }

        .issueform-submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 35px rgba(79, 70, 229, 0.35);
        }

        @media (max-width: 768px) {
          .issueform-card {
            padding: 22px;
            border-radius: 22px;
          }

          .issuepage-title {
            font-size: 22px;
          }

          .issuepage-floating-icon {
            display: none;
          }

          .issueform-top {
            align-items: flex-start;
          }

          .issueform-heading {
            font-size: 20px;
          }
        }
      `}</style>
    </motion.div>
  );
}
