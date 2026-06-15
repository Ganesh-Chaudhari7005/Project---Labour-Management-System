import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiRoute } from "../ApiConfig.js";
import { useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  "https://images.unsplash.com/photo-1581091012184-7c4b3b2b7d7b",
  "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
  "https://images.unsplash.com/photo-1501183638710-841dd1904471",
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
];

export default function PreviousWork() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [gallery, setGallery] = useState([]);

  const handleLoad = (index) => {
    setLoadedImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

   const fetchPhotos = async () => {
      try {
        const res = await fetch(`${ApiRoute}photos`);
        const data = await res.json();
  
        if (data.success) {
          setGallery(data.photos);
        }
        console.log(data.photos);
      } catch (err) {
        console.error(err);
      }
    };

    useEffect(()=>{
      fetchPhotos();
    },[])
  return (
    <section className="re-gallery-wrapper">
      <div className="container py-5">
        {/* Header */}
        <div className="re-about-header mb-5">
          <h2 className="re-about-title page-head-def">
            Photo<span> Gallery</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="re-gallery-grid">
          {gallery.map((img, index) => (
            <motion.div
              key={index}
              className="re-gallery-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setSelectedImage(`${ApiRoute}${img.uploadpath}`)}
            >
              {/* Always visible skeleton (prevents empty gap) */}
              <div
                className={`re-img-skeleton ${
                  loadedImages[index] ? "loaded" : ""
                }`}
              />

              <img
                src={`${ApiRoute}${img.uploadpath}`}
                alt="work"
                onLoad={() =>
                  setLoadedImages((prev) => ({
                    ...prev,
                    [index]: true,
                  }))
                }
                className={`re-gallery-img ${
                  loadedImages[index] ? "show" : ""
                }`}
              />
            </motion.div>
          ))}
        </div>

        {/* Popup */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="re-popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                className="re-popup-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.75 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img src={selectedImage} alt="preview" />

                <button
                  className="re-popup-close"
                  onClick={() => setSelectedImage(null)}
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
