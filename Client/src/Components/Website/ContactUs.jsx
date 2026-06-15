import { motion } from "framer-motion";
export default function ContactUs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="cl-cont-section">
        <div className="container">
          {/* Header */}
          <div className="cl-cont-header">
            <h2 className="cl-cont-title">
              Contact <span>Us</span>
            </h2>

            <p className="cl-cont-subtitle">
              Get in touch with Royal Enterprises for tile installation, marble
              fitting, marble polishing, and paver block installation services.
            </p>
          </div>

          {/* Main Section */}
          <div className="cl-cont-wrapper">
            {/* Contact Info */}
            <div className="cl-cont-info-card">
              <h3 className="cl-cont-card-title">Contact Information</h3>

              <div className="cl-cont-item">
                <div className="cl-cont-icon">
                  <i className="bi bi-telephone-fill"></i>
                </div>

                <div>
                  <h6>Phone Number</h6>
                  <p>+91 7350232132</p>
                </div>
              </div>

              <div className="cl-cont-item">
                <div className="cl-cont-icon">
                  <i className="bi bi-envelope-fill"></i>
                </div>

                <div>
                  <h6>Email Address</h6>
                  <p className="cl-cont-email">
                    royalenterprisespune7005@gmail.com
                  </p>
                </div>
              </div>

              <div className="cl-cont-item">
                <div className="cl-cont-icon">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>

                <div>
                  <h6>Address</h6>
                  <p>Pune, Maharashtra, India</p>
                </div>
              </div>

              <div className="cl-cont-item">
                <div className="cl-cont-icon">
                  <i className="bi bi-clock-fill"></i>
                </div>

                <div>
                  <h6>Working Hours</h6>
                  <p>Monday - Saturday</p>
                  <p>09:00 AM - 07:00 PM</p>
                </div>
              </div>

              <div className="cl-cont-btn-group">
                <a href="tel:+919876543210" className="cl-cont-call-btn">
                  <i className="bi bi-telephone-fill"></i>
                  Call Now
                </a>

                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="cl-cont-whatsapp-btn"
                >
                  <i className="bi bi-whatsapp"></i>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
