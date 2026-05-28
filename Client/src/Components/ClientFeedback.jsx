import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ApiRoute } from "./ApiConfig";
import { ToastContainer, toast } from "react-toastify";

export default function ClientFeedback() {
 const[projectList , setProjectList] = useState([]);
  const [feedbackData, setFeedbackData] = useState({
    project: "",
    feedback: "",
    rating: 0,
  });


const getprojectList = async()=>{
    let clientID = sessionStorage.getItem('ClientID');
    console.log(clientID);
    
    let reqList = await fetch(`${ApiRoute}getProjectsList`,  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({clientID}),
      });

      let data = await reqList.json();

      if(data.success){
        setProjectList(data.ProjectDetails);
      }
    }


    useEffect(()=>{
        getprojectList();
    },[])
  const handleFeedbackChange = (e) => {
    setFeedbackData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRating = (value) => {
    setFeedbackData((prev) => ({
      ...prev,
      rating: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let clientID = sessionStorage.getItem("ClientID");

    let req = await fetch(`${ApiRoute}insertFeedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...feedbackData,
        clientID,
      }),
    });

    let data = await req.json();

    if (data.success) {
      toast.success("Feedback Submitted Successfully");

      setFeedbackData({
        project: "",
        feedback: "",
        rating: 0,
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
      className="clientfeedback-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
        <ToastContainer/>
      <div className="project-top-section">
        <div className="project-header-card">
          <div className="project-header-left">
            <div className="project-badge">
              <i className="ri-customer-service-2-line"></i>
              Client Feedback
            </div>

            <h2 className="clientfeedback-title mb-0">
              Share Your Experience With Us
            </h2>

            <p className="clientfeedback-subtitle">
              Your feedback helps us improve our marble and tile services for
              future projects.
            </p>
          </div>

          <div className="clientfeedback-header-icon">
            <i className="ri-star-smile-line"></i>
          </div>

          <div className="project-bg-circle one"></div>
          <div className="project-bg-circle two"></div>
        </div>
      </div>

      {/* Feedback Card */}
      <motion.form
        className="clientfeedback-card"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Top Section */}
        <div className="clientfeedback-top">
          <div className="clientfeedback-iconbox">
            <i className="ri-feedback-line"></i>
          </div>

          <div>
            <h3 className="clientfeedback-heading mb-0">
               Feedback Form
            </h3>

            <p className="clientfeedback-text mb-0">
              Tell us about your experience with our work quality and service.
            </p>
          </div>
        </div>

        {/* Project Select */}
        <div className="clientfeedback-group">
          <label className="clientfeedback-label">
            <i className="ri-building-2-line"></i>
            Select Project
          </label>

          <div className="clientfeedback-select-wrapper">
            <select
              className="clientfeedback-input"
              name="project"
              value={feedbackData.project}
              onChange={handleFeedbackChange}
              required
            >
              <option value="">Choose Project</option>

              {projectList.map((data, index) => (
                <option key={index} value={data.ProjectID}>
                   {data.ProjectName || '-'}
                </option>
              ))}
            </select>

            <i className="ri-arrow-down-s-line clientfeedback-select-icon"></i>
          </div>
        </div>

        {/* Rating */}
        <div className="clientfeedback-group">
          <label className="clientfeedback-label">
            <i className="ri-star-line"></i>
            Service Rating
          </label>

          <div className="clientfeedback-rating-box">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.i
                whileTap={{ scale: 0.9 }}
                key={star}
                onClick={() => handleRating(star)}
                className={
                  feedbackData.rating >= star
                    ? "ri-star-fill clientfeedback-star active"
                    : "ri-star-line clientfeedback-star"
                }
              ></motion.i>
            ))}
          </div>

          <span className="clientfeedback-rating-text">
            {feedbackData.rating === 0 &&
              "Tap on stars to rate your experience"}

            {feedbackData.rating === 1 && "Poor Experience"}
            {feedbackData.rating === 2 && "Average Service"}
            {feedbackData.rating === 3 && "Good Service"}
            {feedbackData.rating === 4 && "Very Good Experience"}
            {feedbackData.rating === 5 && "Excellent Work & Service"}
          </span>
        </div>

        {/* Feedback */}
        <div className="clientfeedback-group">
          <label className="clientfeedback-label">
            <i className="ri-chat-1-line"></i>
            Your Feedback
          </label>

          <textarea
            className="clientfeedback-textarea"
            name="feedback"
            rows="7"
            placeholder="Share your feedback about tile fitting, marble finishing, worker behaviour, project quality, cleanliness, etc..."
            value={feedbackData.feedback}
            onChange={handleFeedbackChange}
            required
          ></textarea>
        </div>

        {/* Submit */}
        <button type="submit" className="clientfeedback-submit-btn">
          <i className="ri-send-plane-fill"></i>
          Submit Feedback
        </button>
      </motion.form>

      <style jsx>{`
        .clientfeedback-page {
          width: 100%;
        }

        .clientfeedback-title {
          font-size: 26px;
          font-weight: 500;
          color: #111827;
        }

        .clientfeedback-subtitle {
          margin-top: 8px;
          max-width: 550px;
          color: rgba(255, 255, 255, 0.82);
          font-size: 14px;
          line-height: 1.7;
        }

        .clientfeedback-header-icon {
          position: absolute;
          right: 35px;
          top: 50%;
          transform: translateY(-50%);
          width: 100px;
          height: 100px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .clientfeedback-header-icon i {
          color: white;
          font-size: 46px;
        }

        .clientfeedback-card {
          margin-top: 24px;
          background: linear-gradient(145deg, #ffffff, #f8fafc);
          border-radius: 28px;
          padding: 32px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          gap: 26px;
          overflow: hidden;
          position: relative;
        }

        .clientfeedback-card::before {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.05);
          top: -120px;
          right: -120px;
        }

        .clientfeedback-top {
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          z-index: 2;
        }

        .clientfeedback-iconbox {
          width: 68px;
          min-width: 68px;
          height: 68px;
          border-radius: 22px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 30px rgba(99, 102, 241, 0.25);
        }

        .clientfeedback-iconbox i {
          color: white;
          font-size: 30px;
        }

        .clientfeedback-heading {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
        }

        .clientfeedback-text {
          margin-top: 4px;
          font-size: 14px;
          color: #6b7280;
        }

        .clientfeedback-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .clientfeedback-label {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .clientfeedback-label i {
          color: #6366f1;
          font-size: 16px;
        }

        .clientfeedback-select-wrapper {
          position: relative;
        }

        .clientfeedback-select-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #6b7280;
          font-size: 20px;
          pointer-events: none;
        }

        .clientfeedback-input,
        .clientfeedback-textarea {
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

        .clientfeedback-input {
          height: 58px;
          appearance: none;
          padding-right: 45px;
        }

        .clientfeedback-textarea {
          resize: none;
          min-height: 180px;
          line-height: 1.8;
        }

        .clientfeedback-input:focus,
        .clientfeedback-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 5px rgba(99, 102, 241, 0.1);
          transform: translateY(-1px);
        }

        .clientfeedback-rating-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 4px;
        }

        .clientfeedback-star {
          font-size: 34px;
          color: #d1d5db;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clientfeedback-star:hover {
          transform: scale(1.12);
        }

        .clientfeedback-star.active {
          color: #fbbf24;
          text-shadow: 0 6px 16px rgba(251, 191, 36, 0.35);
        }

        .clientfeedback-rating-text {
          font-size: 13px;
          color: #6b7280;
          padding-left: 4px;
        }

        .clientfeedback-submit-btn {
          height: 60px;
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
          box-shadow: 0 18px 30px rgba(99, 102, 241, 0.25);
          position: relative;
          z-index: 2;
        }

        .clientfeedback-submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 22px 38px rgba(99, 102, 241, 0.35);
        }

        .clientfeedback-submit-btn i {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .clientfeedback-card {
            padding: 22px;
            border-radius: 24px;
          }

          .clientfeedback-title {
            font-size: 24px;
          }

          .clientfeedback-header-icon {
            display: none;
          }

          .clientfeedback-top {
            align-items: flex-start;
          }

          .clientfeedback-heading {
            font-size: 20px;
          }

          .clientfeedback-star {
            font-size: 30px;
          }
        }
      `}</style>
    </motion.div>
  );
}
