import React, { useState } from "react";
import { motion } from "framer-motion";
import { ApiRoute } from "./ApiConfig";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
export default function Carousel() {
  const [gallery, setGallery] = useState([]);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]); // previews
  const [imageFiles, setImageFiles] = useState([]); // actual files
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch(`${ApiRoute}carousel`);
      const data = await res.json();

      if (data.success) {
        setGallery(data.photos);
      }
      console.log(data.photos);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const maxSize = 2 * 1024 * 1024;

    const validFiles = [];
    const previewUrls = [];

    for (let file of files) {
      // type check
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      // size check
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 2MB`);
        continue;
      }

      validFiles.push(file);
      previewUrls.push(URL.createObjectURL(file));
    }

    if (validFiles.length === 0) return;

    setImageFiles(validFiles);
    setImages(previewUrls);
  };
  const handleUpload = async () => {
    if (imageFiles.length === 0) {
      toast.error("Please select images");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    imageFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const res = await fetch(`${ApiRoute}upload-photo-carousel`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Photos Uploaded Successfully");
        setOpen(false);
        setImages([]);
        setImageFiles([]);
        fetchPhotos();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoDelete = async (photoid) => {
    const reqphotodel = await fetch(`${ApiRoute}delete-Photo-carousel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ID: photoid }),
    });

    let resultDelete = await reqphotodel.json();
    if (resultDelete.success) {
      toast.success("Photo Deleted Successfully");
      fetchPhotos();
    } else {
      toast.error("Failed to Delete Image");
    }
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ToastContainer />
        <div className="pg-container">
          <br />
          <h2 className="pg-title">Home Carousel</h2>

          <button className="pg-add-btn" onClick={() => setOpen(true)}>
            + Add Photo
          </button>
        </div>
        <br />
        <div className="pg-gallery-grid">
          <div className="pg-table-wrapper">
            <table className="pg-table table table-bordered">
              <thead>
                <tr>
                  <th className="tbl-head" style={{ textAlign: "center" }}>
                    Sr. No.
                  </th>
                  <th className="tbl-head" style={{ textAlign: "center" }}>
                    Image
                  </th>
                  <th className="tbl-head" style={{ textAlign: "center" }}>
                    Uploaded On
                  </th>
                  <th className="tbl-head" style={{ textAlign: "center" }}>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {gallery.length > 0 ? (
                  gallery.map((photo, index) => (
                    <tr key={photo.photoid}>
                      <td style={{ textAlign: "center" }}>{index + 1}</td>

                      <td>
                        <div className="pg-img-box">
                          <img
                            src={`${ApiRoute}${photo.uploadpath}`}
                            alt="gallery"
                          />
                        </div>
                      </td>

                      <td
                        style={{
                          fontSize: "21px",
                          fontWeight: "500",
                          textAlign: "center",
                        }}
                      >
                        {photo.uploaddate
                          ? new Date(photo.uploaddate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              },
                            )
                          : "—"}
                      </td>

                      <td>
                        <button
                          onClick={() => handlePhotoDelete(photo.photoid)}
                          className="pg-delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="pg-empty">
                      No photos uploaded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {open && (
        <motion.div
          className="pg-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="pg-modal-box"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="pg-modal-title">Upload Photo</h4>

            <label className="pg-upload-box">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="pg-file-input"
              />

              {images.length > 0 ? (
                <div className="pg-preview-grid">
                  {images.map((img, index) => (
                    <img key={index} src={img} className="pg-preview-img" />
                  ))}
                </div>
              ) : (
                <p className="pg-upload-text">Click to upload images</p>
              )}
            </label>

            <button
              className="pg-close-btn mx-3"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
            <button
              className="pg-upload-btn"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
