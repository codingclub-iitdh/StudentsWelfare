import React, { useState } from "react";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../images/logo-iit.jpg";
import Footer from "../Footer/footer";
import "./Sidebar.css";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();

  const isWellnessPage =
    location.pathname.startsWith("/wellness") ||
    location.pathname === "/wellness-home" ||
    location.pathname.startsWith("/health") ||
    location.pathname.startsWith("/counselling") ||
    location.pathname.startsWith("/student-wellness-mentors") ||
    location.pathname.startsWith("/dean_associate_deans_wellness");
  const isHomePage = location.pathname === "/";
  const isStudentWelfareHome = location.pathname === "/student-welfare-home";

  const wellnessLinks = [
    { path: "/dean_associate_deans_wellness", label: "Faculty in Charge" },
    { path: "/health", label: "Health" },
    { path: "/counselling", label: "Counselling" },
    { path: "/student-wellness-mentors", label: "Wellness Mentors" },
  ];

  const studentWelfareLinks = [
    {
      label: "Administration",
      dropdown: [
        { path: "/dean_associate_deans", label: "Dean and Associate Deans" },
        { path: "/administrative_office", label: "Administrative Office" },
      ],
    },
    { path: "/student_life", label: "Campus Life" },
    { path: "/student_achievements", label: "Achievements" },
    {
      label: "Facilities",
      dropdown: [
        { path: "/hostels", label: "Hostels" },
        { path: "/mess_canteen", label: "Mess & Canteen" },
        { path: "/gymkhana", label: "Gymkhana" },
        { path: "/swimming-pool", label: "Swimming Pool" },
      ],
    },
  ];

  const links = isHomePage ? [] : (isWellnessPage ? wellnessLinks : studentWelfareLinks);
  const sectionTitle = isWellnessPage ? "WELLNESS SECTION" : "STUDENT WELFARE SECTION";

  const isDropdownActive = (dropdown) => {
    return dropdown.some((subLink) => location.pathname === subLink.path);
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar navbar-expand-lg d-none d-lg-flex custom-navbar shadow-sm">
        <div className="container-fluid px-4">
          <NavLink to="/" className="navbar-brand d-flex align-items-center gap-3">
            <img src={logo} alt="IIT Logo" className="rounded bg-white p-1 shadow-sm" style={{ height: "50px", width: "auto", objectFit: "contain" }} />
            <div className="d-flex flex-column text-white">
              <span className="fw-bold tracking-wide" style={{ fontSize: "1.1rem" }}>STUDENT WELFARE OFFICE</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>Indian Institute of Technology</span>
            </div>
          </NavLink>

          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav gap-2 align-items-center">
              {!isHomePage && links.map((link, index) => (
                <li className={`nav-item ${link.dropdown ? "custom-dropdown" : ""}`} key={index}>
                  {link.dropdown ? (
                    <>
                      <span className={`nav-link text-white dropdown-toggle-text ${isDropdownActive(link.dropdown) ? "active" : ""}`}>
                        {link.label} <FaChevronDown className="ms-1" size={12} />
                      </span>
                      <ul className="custom-dropdown-menu shadow">
                        {link.dropdown.map((subLink, subIndex) => (
                          <li key={subIndex}>
                            <NavLink to={subLink.path} className="dropdown-item">
                              {subLink.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <NavLink to={link.path} className="nav-link text-white rounded px-3 transition-all">
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}

              {!isHomePage && (
                <>
                  <div className="vr text-white opacity-50 mx-2" style={{ height: "24px" }}></div>

                  {/* Cleaned up Section Toggler */}
                  <li className="nav-item">
                    <NavLink
                      to={isWellnessPage ? "/student-welfare-home" : "/wellness-home"}
                      className="btn btn-outline-light btn-sm rounded-pill px-3 fw-medium"
                    >
                      Switch to {isWellnessPage ? "Welfare" : "Wellness"}
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <nav className="navbar d-lg-none custom-navbar shadow-sm px-3 py-2">
        <div className="d-flex justify-content-between align-items-center w-100">
          {!isHomePage ? (
            <button className="btn text-white p-0 border-0 fs-4" onClick={toggle}>
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          ) : (
            <div style={{ width: "24px" }}></div>
          )}
          <span className="text-white fw-bold mx-auto">{sectionTitle}</span>
          <NavLink to="/">
            <img src={logo} alt="logo" className="rounded bg-white p-1" style={{ height: "40px", width: "auto", objectFit: "contain" }} />
          </NavLink>
        </div>
      </nav>

      <div className={`mobile-sidebar-overlay ${isOpen ? "show" : ""}`} onClick={toggle}></div>
      <div className={`custom-sidebar shadow ${isOpen ? "open" : ""}`}>
        <div className="p-4 d-flex flex-column gap-3">
          {links.map((link, index) => (
            <div key={index}>
              {link.dropdown ? (
                <>
                  <div className="text-white-50 fw-bold mb-2 small text-uppercase">{link.label}</div>
                  <div className="d-flex flex-column gap-2 ps-3 border-start border-light border-opacity-25">
                    {link.dropdown.map((subLink, subIndex) => (
                      <NavLink key={subIndex} to={subLink.path} className="text-white text-decoration-none" onClick={toggle}>
                        {subLink.label}
                      </NavLink>
                    ))}
                  </div>
                </>
              ) : (
                <NavLink to={link.path} className="text-white text-decoration-none fw-medium fs-5" onClick={toggle}>
                  {link.label}
                </NavLink>
              )}
            </div>
          ))}
          
          <hr className="text-white border-top border-2 opacity-25" />
          
          <NavLink
            to={isWellnessPage ? "/student-welfare-home" : "/wellness-home"}
            className="btn btn-light w-100 fw-bold text-dark"
            onClick={toggle}
          >
            Go to {isWellnessPage ? "Student Welfare" : "Wellness"}
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100%" }}
      >
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
};

export default Sidebar;
