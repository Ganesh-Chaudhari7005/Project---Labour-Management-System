import React from "react";
import { uploadUrl } from "../uploadConfig.js";

export default function ShowLabourDetails(props) {
  return (
    <div
      className="outerview"
      style={{
        visibility: props.isVisible ? "visible" : "hidden",
        opacity: props.isVisible ? 1 : 0,
      }}
    >
      <div className="showLabDetCont">
        <button onClick={props.onClose} className="close-btn">
          ✖
        </button>

        <div className="row align-items-center">
          {/* Image */}
          <div className="col-lg-4 text-center mb-3 mb-lg-0">
            <img
              src={`${uploadUrl}${props.imgpath}`}
              className="img-fluid rounded img-style"
              alt="profile"
              onError={(e) => {
                e.target.src = "/defaultlabouricon.png";
              }}
            />
          </div>

          {/* Details */}
          <div className="col-lg-8">
            <h4 className="fw-bold mb-3 text-capitalize">{props.Name}</h4>

            <div className="detail-row">
              <span>Type</span>
              <p>{props.type}</p>
            </div>

            <div className="detail-row">
              <span>Email</span>
              <p>{props.email}</p>
            </div>

            <div className="detail-row">
              <span>Phone</span>
              <p>{props.phone}</p>
            </div>

            <div className="detail-row">
              <span>Address</span>
              <p>{props.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
