import React from "react";
import { motion } from "framer-motion";
export default function Home() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <section className="re-hero-section">
          <div className="container-fluid">
            <div className="container p-0">
              <div className="row">
                <div className="col-lg-8">
                  <div
                    id="carouselExampleControls"
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-caption-custom">
                      <h2>Building Your Dreams</h2>
                      <p>Quality Services you can trust</p>
                    </div>
                    <div className="carousel-inner">
                      <div className="carousel-item active">
                        <img
                          src="https://static.vecteezy.com/system/resources/thumbnails/047/022/839/small/sunlight-streaming-through-window-onto-white-tiled-floor-in-empty-room-free-photo.jpeg"
                          className="d-block carousel-image"
                          alt="..."
                        />
                      </div>
                      <div className="carousel-item">
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/050/523/691/large_2x/a-large-white-marble-bathtub-sits-in-a-room-with-a-marble-wall-free-photo.jpeg"
                          className="d-block carousel-image"
                          alt="..."
                        />
                      </div>
                      <div className="carousel-item">
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/046/366/841/non_2x/a-bathroom-with-a-white-toilet-and-a-white-sink-photo.jpg"
                          className="d-block carousel-image"
                          alt="..."
                        />
                      </div>
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselExampleControls"
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselExampleControls"
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="re-service-form">
                    <h4 className="re-form-title">Request a Service</h4>

                    <p className="re-form-subtext">
                      Get in touch with us for your construction needs.
                    </p>

                    <form>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control re-input"
                          placeholder="Full Name"
                        />
                      </div>

                      <div className="mb-3">
                        <input
                          type="email"
                          className="form-control re-input"
                          placeholder="Email Address"
                        />
                      </div>

                      <div className="mb-3">
                        <input
                          type="tel"
                          className="form-control re-input"
                          placeholder="Mobile Number"
                        />
                      </div>

                      {/* ADDRESS FIELD */}
                      <div className="mb-3">
                        <textarea
                          className="form-control re-input"
                          rows="2"
                          placeholder="Full Address"
                        ></textarea>
                      </div>

                      {/* OPTIONAL: CITY + PIN */}
                      <div className="row">
                        <div className="col-6 mb-3">
                          <input
                            type="text"
                            className="form-control re-input"
                            placeholder="City"
                          />
                        </div>
                        <div className="col-6 mb-3">
                          <input
                            type="text"
                            className="form-control re-input"
                            placeholder="Pincode"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <textarea
                          className="form-control re-input"
                          rows="3"
                          placeholder="Describe your requirement"
                        ></textarea>
                      </div>

                      <button type="submit" className="re-submit-btn w-100">
                        Submit Request
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-3 sec-back">
          <div className="container-fluid">
            <div className="container">
              <h2 className="text-center py-3 mb-5">
                --- About <span className="section-head">Us</span> ---
              </h2>
              <div className="row g-5">
                <div className="col-lg-6">
                  <p className="about-text">
                    Royal Enterprises is a trusted name in delivering
                    high-quality construction and finishing services. We
                    specialize in professional tile installation and marble
                    installation, helping transform spaces with precision,
                    durability, and style.
                  </p>
                  <p className="about-text">
                    With a strong focus on craftsmanship and attention to
                    detail, we ensure that every project—whether residential or
                    commercial—is completed to the highest standards. Our goal
                    is to provide reliable services that enhance the beauty and
                    strength of your spaces.
                  </p>
                  <br />
                  <button className="about-readmore">Read more</button>
                </div>
                <div className="col-lg-6">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="aboutimg-cont">
                        <img
                          src="https://static.vecteezy.com/system/resources/thumbnails/047/022/839/small/sunlight-streaming-through-window-onto-white-tiled-floor-in-empty-room-free-photo.jpeg"
                          class="aboutimg1 mb-3"
                        />
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/050/523/691/large_2x/a-large-white-marble-bathtub-sits-in-a-room-with-a-marble-wall-free-photo.jpeg"
                          class="aboutimg2"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="aboutimgcont2">
                        <img
                          src="https://static.vecteezy.com/system/resources/thumbnails/047/022/839/small/sunlight-streaming-through-window-onto-white-tiled-floor-in-empty-room-free-photo.jpeg"
                          class="aboutimg3 mb-3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div class="image-layout">
                    <img
                      src="https://static.vecteezy.com/system/resources/thumbnails/047/022/839/small/sunlight-streaming-through-window-onto-white-tiled-floor-in-empty-room-free-photo.jpeg"
                      class="img img1"
                    />
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/050/523/691/large_2x/a-large-white-marble-bathtub-sits-in-a-room-with-a-marble-wall-free-photo.jpeg"
                      class="img img2"
                    />
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/046/366/841/non_2x/a-bathroom-with-a-white-toilet-and-a-white-sink-photo.jpg"
                      class="img img3"
                    />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="container-fluid">
            <div className="container">
              <h2 className="text-center py-3 mb-5">
                --- Services <span className="section-head">We Provide</span>{" "}
                ---
              </h2>

              <div className="row g-5">
                {/* Tile Installation */}
                <div className="col-lg-3 col-md-6">
                  <div className="service-card">
                    <img
                      src="/public/tileinstall.png"
                      alt="Tile Installation"
                    />
                    <div className="service-content">
                      <h5>Tile Installation</h5>
                      <p>
                        Precision tile work for durable and stylish flooring.
                      </p>
                      <button className="about-readmore">More Details</button>
                    </div>
                  </div>
                </div>

                {/* Marble Installation */}
                <div className="col-lg-3 col-md-6">
                  <div className="service-card">
                    <img src="public/marble.jfif" alt="Marble Installation" />
                    <div className="service-content">
                      <h5>Marble Installation</h5>
                      <p>Elegant marble fitting for premium interiors.</p>
                      <button className="about-readmore">More Details</button>
                    </div>
                  </div>
                </div>

                {/* Paver Block */}
                <div className="col-lg-3 col-md-6">
                  <div className="service-card">
                    <img
                      src="public/paverblock2.jpg"
                      alt="Paver Block Installation"
                    />
                    <div className="service-content">
                      <h5>Paver Block</h5>
                      <p>Strong and attractive outdoor paving solutions.</p>
                      <button className="about-readmore">More Details</button>
                    </div>
                  </div>
                </div>

                {/* Marble Polishing */}
                <div className="col-lg-3 col-md-6">
                  <div className="service-card">
                    <img
                      src="public/marblepolish.jfif"
                      alt="Marble Polishing"
                    />
                    <div className="service-content">
                      <h5>Marble Polishing</h5>
                      <p>Restore shine and smooth finish of marble surfaces.</p>
                      <button className="about-readmore">More Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5 sec-back">
          <div className="container">
            <h2 className="text-center mb-5">
              --- Why <span className="section-head">Choose Us</span> ---
            </h2>

            <div className="row g-4">
              {/* Item 1 */}
              <div className="col-lg-3 col-md-6">
                <div className="choose-card text-center p-4">
                  <i className="bi bi-person-check-fill choose-icon"></i>
                  <h5 className="mt-3">Expert Team</h5>
                  <p>
                    Skilled professionals delivering high-quality workmanship.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="col-lg-3 col-md-6">
                <div className="choose-card text-center p-4">
                  <i className="bi bi-gem choose-icon"></i>
                  <h5 className="mt-3">Premium Quality</h5>
                  <p>We use the best materials for long-lasting results.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="col-lg-3 col-md-6">
                <div className="choose-card text-center p-4">
                  <i className="bi bi-clock-fill choose-icon"></i>
                  <h5 className="mt-3">On-Time Delivery</h5>
                  <p>We complete projects within the promised time.</p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="col-lg-3 col-md-6">
                <div className="choose-card text-center p-4">
                  <i className="bi bi-currency-rupee choose-icon"></i>
                  <h5 className="mt-3">Affordable Pricing</h5>
                  <p>Transparent pricing with no hidden costs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-5">
          <div className="container py-5">
            <h2 className="text-center mb-5">
              --- What Our <span className="section-head">Customers Say</span>{" "}
              ---
            </h2>

            <div className="slider">
              <div className="slide-track">
                {/* Testimonial 1 */}
                <div className="testimonial-card">
                  <p>"Excellent tile installation work. Very professional!"</p>
                  <h6>- Rahul Sharma</h6>
                </div>

                {/* Testimonial 2 */}
                <div className="testimonial-card">
                  <p>"Marble finishing was top-notch. Highly recommended."</p>
                  <h6>- Amit Patil</h6>
                </div>

                {/* Testimonial 3 */}
                <div className="testimonial-card">
                  <p>"Work completed on time with great quality."</p>
                  <h6>- Sneha Joshi</h6>
                </div>

                {/* Testimonial 4 */}
                <div className="testimonial-card">
                  <p>"Affordable pricing and amazing results!"</p>
                  <h6>- Vikram Singh</h6>
                </div>

                {/* Duplicate for smooth infinite scroll */}
                <div className="testimonial-card">
                  <p>"Excellent tile installation work. Very professional!"</p>
                  <h6>- Rahul Sharma</h6>
                </div>

                <div className="testimonial-card">
                  <p>"Marble finishing was top-notch. Highly recommended."</p>
                  <h6>- Amit Patil</h6>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
}
