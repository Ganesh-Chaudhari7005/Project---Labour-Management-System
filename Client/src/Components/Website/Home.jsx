import React from "react";
import { ApiRoute } from "../ApiConfig";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
export default function Home() {
    const [data, setData] = useState([]);



  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    requirement: "",
  });
  useEffect(() => {
    fetch(`${ApiRoute}testimonials`)
      .then((res) => res.json())
      .then(setData);
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.city.trim()) newErrors.city = "City is required";

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Invalid pincode";
    }

    if (!formData.requirement.trim()) {
      newErrors.requirement = "Requirement is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch(`${ApiRoute}insert-reqform-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
         setSubmitted(true);

        // reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          address: "",
          city: "",
          pincode: "",
          requirement: "",
        });

        setErrors({});
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    }
  };

  const [errors, setErrors] = useState({});
  const [gallery, setGallery] = useState([]);

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

  useEffect(() => {
    fetchPhotos();
  }, []);
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
              <div className="row g-3">
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
                      {gallery.map((img, index) => (
                        <div
                          className={`carousel-item ${index === 0 ? "active" : ""}`}
                          key={index}
                        >
                          <img
                            src={`${ApiRoute}${img.uploadpath}`}
                            className="d-block w-100 carousel-image"
                            alt="..."
                          />
                        </div>
                      ))}
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

                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.div
                          key="success"
                          className="re-success-box"
                          initial={{ opacity: 0, y: 20, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h5>✅ Request Submitted</h5>
                          <p>We’ll contact you shortly.</p>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form"
                          onSubmit={handleSubmit}
                          initial={{ opacity: 0, y: 20, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="form-control re-input"
                              placeholder="Full Name"
                            />
                            <small className="text-danger error-text">
                              {errors.name || " "}
                            </small>
                          </div>

                          <div>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="form-control re-input"
                              placeholder="Email Address"
                            />
                            <small className="text-danger error-text">
                              {errors.email || " "}
                            </small>
                          </div>

                          <div>
                            <input
                              type="tel"
                              className="form-control re-input"
                              placeholder="Mobile Number"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                            />
                            <small className="text-danger error-text">
                              {errors.mobile || " "}
                            </small>
                          </div>

                          <div className="mb-2">
                            <textarea
                              className="form-control re-input"
                              rows="2"
                              placeholder="Full Address"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                            ></textarea>
                          </div>

                          <div className="row">
                            <div className="col-6 mb-3">
                              <input
                                type="text"
                                className="form-control re-input"
                                placeholder="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="col-6 mb-3">
                              <input
                                type="text"
                                className="form-control re-input"
                                placeholder="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <textarea
                              className="form-control re-input"
                              rows="3"
                              placeholder="Describe your requirement"
                              name="requirement"
                              value={formData.requirement}
                              onChange={handleChange}
                            ></textarea>
                          </div>

                          <button type="submit" className="re-submit-btn w-100">
                            Submit Request
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>
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
                  <Link to="about-us" about-us>
                    <button className="about-readmore">Read more</button>
                  </Link>
                </div>
                <div className="col-lg-6">
                  <div className="row g-3">
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
                      src="/tileinstall.png"
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
                    <img src="/marble.jfif" alt="Marble Installation" />
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
                      src="/paverblock2.jpg"
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
                      src="/marblepolish.jfif"
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
        <section className="tmx9-testimonial-root">
          <div className="tmx9-container">
            <h2 className="text-center mb-5">
              What Our <span className="section-head">Customers Say</span>
            </h2>

            <div className="tmx9-track">
              {[...data, ...data].map((item, index) => (
                <div className="tmx9-card" key={index}>
                  <div className="tmx9-avatar">{item?.name.charAt(0)}</div>

                  <p>"{item?.message}"</p>

                  <div>{"⭐".repeat(item?.rating)}</div>

                  <h6>- {item.name}</h6>
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
}
