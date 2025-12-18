import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
// import logo from '../../images/logo_black_final.png';
import logo from "../../images/logo-iit.jpg";
import Footer from "../Footer/footer";
import "./Sidebar.css";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };

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
  const isStudentWelfareSection = !isWellnessPage && !isHomePage;

  const wellnessLinks = [
    {
      path: "/dean_associate_deans_wellness",
      label: "Associate Dean & Faculty in Charge",
    },
    { path: "/health", label: "Health" },
    { path: "/counselling", label: "Counselling" },
    { path: "/student-wellness-mentors", label: "Student Wellness Mentors" },
  ];

  const studentWelfareLinks = [
    { path: "/dean_associate_deans", label: "Dean and Associate Deans" },
    { path: "/administrative_office", label: "Administrative Office" },
    { path: "/student_life", label: "Students Campus Life" },
    { path: "/student_achievements", label: "Student Achievements" },
    { path: "/hostels", label: "Hostels" },
    { path: "/mess_canteen", label: "Mess & Canteen" },
    { path: "/gymkhana", label: "Gymkhana" },
  ];

  // wellness-specific links will be added to `wellnessLinks` so they show only under wellness

  let links = [];
  let sectionTitle = "STUDENT WELFARE SECTION";

  if (isWellnessPage) {
    links = wellnessLinks;
    sectionTitle = "WELLNESS SECTION";
  } else if (!isHomePage) {
    links = studentWelfareLinks;
  }

  const handleTitleClick = () => {
    if (isWellnessPage) {
      window.location.href = "/wellness-home";
    } else {
      window.location.href = "/student-welfare-home";
    }
  };

  return (
    <>
      {/* Navbar for larger screens */}
      <nav className="navbar navbar-expand-lg d-none d-lg-flex custom-navbar">
        <NavLink to="/" className="navbar-brand custom-nav-image-wrapper">
          <img src={logo} alt="logo" className="rounded custom-nav-image" />
        </NavLink>

        {/* Mini links beside small divider near logo - render per route */}
        {isHomePage ? (
          // Root page: show both Student Welfare (links to student-welfare-home) and Wellness (links to wellness-home)
          <div className="mini-section-links d-flex align-items-center">
            <NavLink
              to="/student-welfare-home"
              className={"text-decoration-none text-white mini-left"}
            >
              Student Welfare
            </NavLink>

            <div
              className="mini-divider d-inline-block ms-2 me-2"
              style={{ height: "30px", width: "1px", backgroundColor: "white" }}
            />

            <NavLink
              to="/wellness-home"
              className={"text-decoration-none text-white mini-right"}
            >
              Wellness
            </NavLink>
          </div>
        ) : isWellnessPage ? (
          // Inside wellness: show Student Welfare (left -> root) and Wellness (right -> wellness-home)
          <div className="mini-section-links d-flex align-items-center">
            <NavLink
              to="/"
              className={"text-decoration-none text-white mini-left"}
            >
              Student Welfare
            </NavLink>

            <div
              className="mini-divider d-inline-block ms-2 me-2"
              style={{ height: "30px", width: "1px", backgroundColor: "white" }}
            />

            <NavLink
              to="/wellness-home"
              className={
                "text-decoration-none text-white mini-right" +
                (isWellnessPage ? " active-mini" : "")
              }
            >
              Wellness
            </NavLink>
          </div>
        ) : (
          // Inside student welfare (not root, not wellness): show Student Welfare (left -> root) and Home (right -> student-welfare-home)
          <div className="mini-section-links d-flex align-items-center">
            <NavLink
              to="/"
              className={"text-decoration-none text-white mini-left"}
            >
              Student Welfare
            </NavLink>

            <div
              className="mini-divider d-inline-block ms-2 me-2"
              style={{ height: "30px", width: "1px", backgroundColor: "white" }}
            />

            <NavLink
              to="/student-welfare-home"
              className={
                "text-decoration-none text-white mini-right" +
                (isStudentWelfareHome ? " active-mini" : "")
              }
            >
              Home
            </NavLink>
          </div>
        )}

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav w-100 me-3 justify-content-center">
            {links.map((link, index) => (
              <li className="nav-item custom-item-navbar" key={index}>
                <NavLink
                  to={link.path}
                  className="nav-link"
                  style={{ fontSize: "1.1vw" }}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Navbar for smaller screens */}
      {
        <nav className="navbar navbar-expand-lg d-lg-none custom-navbar">
          <div className="container-fluid justify-content-around">
            {/* Hide hamburger on mobile for the root (home) page */}
            {!isHomePage && (
              <button className="navbar-toggler" type="button" onClick={toggle}>
                {isOpen ? (
                  <FaTimes style={{ color: "white" }} />
                ) : (
                  <FaBars style={{ color: "white" }} />
                )}
              </button>
            )}

            <div>
              <a href="/" className="text-decoration-none text-white">
                {" "}
                {sectionTitle}{" "}
              </a>
            </div>

            <NavLink to="/" className="navbar-brand custom-nav-image-wrapper">
              <img src={logo} alt="logo" className="rounded custom-nav-image" />
            </NavLink>
          </div>
        </nav>
      }

      {/* Sidebar for mobile */}
      <div className={"custom-sidebar-container"}>
        <div className={`custom-sidebar ${isOpen ? "open" : ""}`}>
          <ul className="navbar-nav" style={{ backgroundColor: "#85198e" }}>
            {links.map((link, index) => (
              <li className="nav-item custom-item-navbar" key={index}>
                <NavLink to={link.path} className="nav-link" onClick={toggle}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      {
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100%" }}
        >
          {/*<div className="topbar d-flex justify-content-between align-items-center">
                    <button className="btn btn-primary d-lg-none" onClick={toggle}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>*/}
          <main>{children}</main>
        </div>
      }
      <Footer />
    </>
  );
};

export default Sidebar;
