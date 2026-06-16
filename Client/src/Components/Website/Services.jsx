import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
export default function Services() {
  const [activeAccordion, setActiveAccordion] = useState("serviceOne");
const [searchParams] = useSearchParams();

useEffect(() => {
  const accordion = searchParams.get("accordion");

  if (accordion) {
    setActiveAccordion(accordion);

    setTimeout(() => {
      document
        .getElementById(accordion)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}, [searchParams]);
  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const accordionAnimation = {
    initial: {
      height: 0,
      opacity: 0,
    },
    animate: {
      height: "auto",
      opacity: 1,
    },
    exit: {
      height: 0,
      opacity: 0,
    },
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  };

  return (
    <section className="re-services-wrapper mb-5">
      <div className="container py-5 mb-5">
        <div className="re-about-header mb-5">
          <h2 className="re-about-title page-head-def">
            Our<span> Services</span>
          </h2>
        </div>

        <div className="accordion re-accordion mb-5">
          {/* Service 1 */}
          <div className="accordion-item re-accordion-item">
            <h2 className="accordion-header">
              <button
                className={`accordion-button re-accordion-button ${
                  activeAccordion !== "serviceOne" ? "collapsed" : ""
                }`}
                onClick={() => toggleAccordion("serviceOne")}
              >
                Tile Installation
              </button>
            </h2>

            <AnimatePresence>
              {activeAccordion === "serviceOne" && (
                <motion.div
                  {...accordionAnimation}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="accordion-body re-accordion-body"
                    id="serviceOne"
                  >
                    <p className="card-text">
                      We provide expert tile installation for floors, walls,
                      kitchens, and bathrooms. Our team ensures perfect
                      alignment, durability, and a flawless finish that enhances
                      your space. We have expertise in installing tiles of the
                      following sizes.
                    </p>

                    <h3 className="card-head" style={{ fontSize: "18px" }}>
                      Flooring Tiles
                    </h3>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Flooring Tiles (600 × 600)</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Flooring Tiles (1200 × 600)</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Flooring Tiles (1600 × 800)</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Flooring Tiles (1800 × 1200)</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Flooring Tiles (1200 × 200)</p>
                    </div>

                    <h3 className="card-head mt-3" style={{ fontSize: "18px" }}>
                      Wall Tiles
                    </h3>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Wall Tiles (600 × 300)</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Wall Tiles (1200 × 600)</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Wall Tiles (1600 × 800)</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Service 2 */}
          <div className="accordion-item re-accordion-item">
            <h2 className="accordion-header">
              <button
                className={`accordion-button re-accordion-button ${
                  activeAccordion !== "serviceTwo" ? "collapsed" : ""
                }`}
                onClick={() => toggleAccordion("serviceTwo")}
              >
                Marble Fitting
              </button>
            </h2>

            <AnimatePresence>
              {activeAccordion === "serviceTwo" && (
                <motion.div
                  {...accordionAnimation}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="accordion-body re-accordion-body"
                    id="serviceTwo"
                  >
                    <p className="card-text">
                      We provide premium marble installation services with
                      precise cutting, fitting, and polishing to achieve a
                      flawless and luxurious finish. Our skilled craftsmen
                      ensure accurate alignment, durability, and exceptional
                      attention to detail in every project.
                    </p>

                    <p className="card-text">
                      We specialize in the installation of various marble and
                      granite elements, including:
                    </p>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Marble & Granite Door Frames</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">
                        Marble & Granite Window Frames
                      </p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Marble Staircases & Steps</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">
                        Kitchen Countertops & Platforms
                      </p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">
                        Wall Cladding & Decorative Marble Work
                      </p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">
                        Flooring & Premium Interior Marble Finishes
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Service 3 */}
          <div className="accordion-item re-accordion-item">
            <h2 className="accordion-header">
              <button
                className={`accordion-button re-accordion-button ${
                  activeAccordion !== "serviceThree" ? "collapsed" : ""
                }`}
                onClick={() => toggleAccordion("serviceThree")}
              >
                Marble Polishing
              </button>
            </h2>

            <AnimatePresence>
              {activeAccordion === "serviceThree" && (
                <motion.div
                  {...accordionAnimation}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="accordion-body re-accordion-body"
                    id="serviceThree"
                  >
                    <p className="card-text">
                      We provide professional marble and granite polishing
                      services that restore shine, enhance appearance, and
                      improve the durability of stone surfaces. Using advanced
                      polishing techniques, we deliver a smooth, elegant, and
                      long-lasting finish.
                    </p>

                    <p className="card-text">Our polishing services include:</p>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Edge Polishing</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Double Side Polishing</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Half Round Polishing</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Full Round Polishing</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Custom Edge Finishing</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Service 4 */}
          <div className="accordion-item re-accordion-item">
            <h2 className="accordion-header">
              <button
                className={`accordion-button re-accordion-button ${
                  activeAccordion !== "serviceFour" ? "collapsed" : ""
                }`}
                onClick={() => toggleAccordion("serviceFour")}
              >
                Paver Block Installation
              </button>
            </h2>

            <AnimatePresence>
              {activeAccordion === "serviceFour" && (
                <motion.div
                  {...accordionAnimation}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className="accordion-body re-accordion-body"
                    id="serviceFour"
                  >
                    <p className="card-text">
                      We undertake all types of paver block installation
                      projects for residential, commercial, and industrial
                      spaces. Our team ensures precise leveling, proper
                      alignment, and durable installation to create strong,
                      attractive, and long-lasting paved surfaces.
                    </p>

                    <p className="card-text">
                      Our paver block installation services include:
                    </p>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Parking Areas</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Garden & Landscape Paving</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">
                        Residential & Commercial Premises
                      </p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">Industrial & Factory Areas</p>
                    </div>

                    <div className="card p-2 mt-3">
                      <p className="card-text">
                        Custom Paver Block Designs & Patterns
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
