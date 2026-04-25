import React from "react";

export default function Services() {
  return (
    <section className="re-services-wrapper mb-5">
      <div className="container py-5 mb-5">
        {/* Header */}
        <div className="re-about-header mb-5">
          <h2 className="re-about-title page-head-def">
            Our<span> Services</span>
          </h2>
          
        </div>

        {/* Accordion */}
        <div className="accordion re-accordion mb-5" id="servicesAccordion">
          {/* Service 1 */}
          <div className="accordion-item re-accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed re-accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#serviceOne"
              >
                🧱 Tile Installation
              </button>
            </h2>
            <div
              id="serviceOne"
              className="accordion-collapse collapse"
              data-bs-parent="#servicesAccordion"
            >
              <div className="accordion-body re-accordion-body">
                We provide expert tile installation for floors, walls, kitchens,
                and bathrooms. Our team ensures perfect alignment, durability,
                and a flawless finish that enhances your space.
              </div>
            </div>
          </div>

          {/* Service 2 */}
          <div className="accordion-item re-accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed re-accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#serviceTwo"
              >
                🪨 Marble Fitting
              </button>
            </h2>
            <div
              id="serviceTwo"
              className="accordion-collapse collapse"
              data-bs-parent="#servicesAccordion"
            >
              <div className="accordion-body re-accordion-body">
                Premium marble installation with precise cutting and polishing.
                We create luxurious and elegant finishes for homes, offices, and
                commercial spaces.
              </div>
            </div>
          </div>

          {/* Service 3 */}
          <div className="accordion-item re-accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed re-accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#serviceThree"
              >
                🏗️ Marble Polishing
              </button>
            </h2>
            <div
              id="serviceThree"
              className="accordion-collapse collapse"
              data-bs-parent="#servicesAccordion"
            >
              <div className="accordion-body re-accordion-body">
                Complete interior finishing solutions including flooring, wall
                design, and surface detailing. We transform empty spaces into
                modern, functional environments.
              </div>
            </div>
          </div>

          {/* Service 4 */}
          <div className="accordion-item re-accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed re-accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#serviceFour"
              >
                🏢 Paver Block Installation
              </button>
            </h2>
            <div
              id="serviceFour"
              className="accordion-collapse collapse"
              data-bs-parent="#servicesAccordion"
            >
              <div className="accordion-body re-accordion-body">
                Large-scale commercial construction and renovation services with
                strict quality control, deadlines, and professional execution.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
