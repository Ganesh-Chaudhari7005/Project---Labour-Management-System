import { NavLink, Outlet, Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <>
        <div className="app-wrapper">
      <section className="py-4">
        <div className="container-fluid nav-cont">
          <div className="name-cont">
            <div className="re-logo-box">
              <img src="/logo.png" alt="RE Logo" className="re-logo-img" />
            </div>
            <h3 className="firmname">Royal Enterprises</h3>
          </div>
          <nav className="navcont">
            <NavLink
              to="."
              end
              className={({ isActive }) =>
                `${isActive ? "nav-text-active" : " "}
                          web-text-def nav-text `
              }
            >
              Home
            </NavLink>
            <NavLink
              to="about-us"
              end
              className={({ isActive }) =>
                `${isActive ? "nav-text-active" : ""}
                         web-text-def   nav-text`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="services"
              end
              className={({ isActive }) =>
                `${isActive ? "nav-text-active" : ""}
                           web-text-def nav-text`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="photo-gallery"
              end
              className={({ isActive }) =>
                `${isActive ? "nav-text-active" : ""}
                           web-text-def nav-text`
              }
            >
              Photo Gallery
            </NavLink>
            <NavLink
              to="contact-us"
              end
              className={({ isActive }) =>
                `${isActive ? "nav-text-active" : ""}
                           web-text-def nav-text`
              }
            >
              Contact Us
            </NavLink>
            <NavLink to="admin" end className="nav-syslogin login-btn">
              System Login
            </NavLink>
          </nav>
        </div>
      </section>
      <main className="app-content">
        <Outlet />
      </main>
      <section className="footer-cont">
        <div className="container-fluid pt-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <div className="footer-name-cont">
                  <div className="re-logo-box">
                    <img
                      src="/logo.png"
                      alt="RE Logo"
                      className="footer--logo-img"
                    />
                  </div>
                  <h3 className="firmname">Royal Enterprises</h3>
                </div>
              </div>
              <div className="col-lg-3">
                <h4 className="footer-head">Contact Us</h4>
                <p className="footer-text">
                  Benkar Wasti, Dhayari, Pune, Maharashtra 411041
                </p>
                <p className="footer-text">
                  <a
                    href="mailto: royalenterprisespune7005@gmail.com"
                    target="_blank"
                  >
                    royalenterprisespune7005@gmail.com
                  </a>
                </p>
                <p className="footer-text">
                  <a href="tel: +91 8484087005">+91 8484087005</a>
                </p>
              </div>

              <div className="col-lg-3">
                <h4 className="footer-head">Important Links</h4>

                <Link to="about-us" className="footer-links">
                  About US
                </Link>
                <br />
                <Link to="photo-gallery" className="footer-links">
                  Photo GalleryS
                </Link>
                <br />
                <Link to="services" className="footer-links">
                  Services
                </Link>
                <br />
                <Link to="about-us" className="footer-links">
                  System Login
                </Link>
              </div>
              <div className="col-lg-3"></div>
              <div className="footer-bottom pt-5">
                <p className="footer-text">
                  Copyright © 2026 | RoyalEnterprises
                </p>
                <p className="footer-text">All Rights Reserved</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}

export default App;
