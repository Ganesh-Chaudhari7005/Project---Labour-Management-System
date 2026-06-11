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

        <div className="row align-items-center g-5">
          {/* Left Content */}
          <div className="col-lg-6">
            <p className="re-about-text">
              Royal Enterprises is a modern construction and finishing company
              specializing in
              <b> tile installation</b>, <b>marble work</b>, and premium surface
              finishing solutions.
            </p>

            <p className="re-about-text">
              We combine skilled craftsmanship with high-grade materials to
              transform ordinary spaces into elegant, durable, and visually
              stunning environments.
            </p>

            <p className="re-about-text">
              Every project is handled with a strong focus on quality control,
              timeline commitment, and client satisfaction — ensuring results
              that stand the test of time.
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
                <img src="https://static.vecteezy.com/system/resources/previews/050/523/691/large_2x/a-large-white-marble-bathtub-sits-in-a-room-with-a-marble-wall-free-photo.jpeg" />
              </div>

              <div className="re-img-row">
                <div className="re-img-box">
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/047/022/839/small/sunlight-streaming-through-window-onto-white-tiled-floor-in-empty-room-free-photo.jpeg" />
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
