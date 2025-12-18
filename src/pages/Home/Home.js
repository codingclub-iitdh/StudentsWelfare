import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import studentWelfareImage from "../../images/studentcampuslife.jpg";
import wellnessImage from "../../images/wellnesscentre.jpg";

function Home() {
  return (
    <motion.div
      className="home-main-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="home-title">
        <h1>Welcome to Student Welfare</h1>
      </div>

      <div className="home-sections-container">
        <div className="section-card-container">
          <NavLink
            to="/student-welfare-home"
            className="section-card student-welfare-card"
            style={{
              "--bg-image": `url(${studentWelfareImage})`,
            }}
          >
            <div className="section-content">
              <h2>Student Welfare</h2>
              <p>Explore hostels, mess, canteen, gymkhana, and campus life</p>
            </div>
          </NavLink>
        </div>

        <div className="section-card-container">
          <NavLink
            to="/wellness-home"
            className="section-card wellness-card"
            style={{
              "--bg-image": `url(${wellnessImage})`,
            }}
          >
            <div className="section-content">
              <h2>Wellness</h2>
              <p>Access counselling, health services, and wellness resources</p>
            </div>
          </NavLink>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
