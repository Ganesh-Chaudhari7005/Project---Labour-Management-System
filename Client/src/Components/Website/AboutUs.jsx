import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <motion.section
      className="re-about-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container">
        {/* Header */}
        <div className="re-about-header mb-5">
          <h2 className="re-about-title page-head-def">
            About <span>Us</span>
          </h2>
          {/* <p className="re-about-subtitle">
            Crafting premium construction and finishing solutions with
            precision, trust, and excellence.
          </p> */}
        </div>

        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-lg-6">
            <p className="re-about-text">
              Royal Enterprises is a trusted contractor firm specializing in
              professional
              <b> tile installation</b>, <b> marble flooring</b>, granite
              fitting, and premium surface finishing services for residential,
              commercial, and industrial projects.
            </p>

            <p className="re-about-text">
              With a team of skilled craftsmen and years of hands-on experience,
              we deliver precision workmanship, flawless finishes, and durable
              installations that enhance the beauty and value of every space.
            </p>

            <p className="re-about-text">
              At Royal Enterprises, we are committed to timely project
              completion, transparent communication, and complete customer
              satisfaction. Our goal is to create surfaces that are not only
              visually impressive but also built to last for years to come.
            </p>

            {/* Feature Cards */}
            <div className="row g-3 mt-4">
              <div className="col-md-6">
                <div className="re-feature-card">
                  <span>🏗️</span>
                  <h5>Expert Craftsmanship</h5>
                  <p>Precision-driven execution in every project.</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="re-feature-card">
                  <span>✨</span>
                  <h5>Premium Quality</h5>
                  <p>We use only trusted, durable materials.</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="re-feature-card">
                  <span>⏱️</span>
                  <h5>On-Time Delivery</h5>
                  <p>Strict timelines without compromising quality.</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="re-feature-card">
                  <span>🤝</span>
                  <h5>Client First</h5>
                  <p>We build long-term trust, not just projects.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Block */}
          <div className="col-lg-6">
            <div className="re-image-grid">
              <div className="re-img-box re-img-big">
                <img src="./floorimage.jpg" />
              </div>

              <div className="re-img-row">
                <div className="re-img-box">
                  <img src="./download.jfif" />
                </div>

                <div className="re-img-box">
                  <img src="./marble.jfif" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
