import React from "react";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";

// Images
import wellnessImage1 from "../../images/wellnesscentre.jpg";
import wellnessImage2 from "../../images/wellnessimage.jpg";

import "./Home.css";

function WellnessHome() {
  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* ===== Top Image Marquee ===== */}
      <div className="App">
        <Marquee direction="left" speed={100} pauseOnHover={true}>
          {[wellnessImage1, wellnessImage2].map((img, index) => (
            <div key={index} className="image_wrapper">
              <img src={img} alt={`Wellness ${index + 1}`} />
            </div>
          ))}
        </Marquee>
      </div>

      {/* ===== About + Charter Section ===== */}
      <div className="wrapper-about">
        {/* === About Section === */}
        <div className="about-page">
          <ul>
            <p className="about-header">About Wellness Centre</p>
            <li>
              <p>
                The Wellness Centre at IIT Dharwad provides comprehensive health
                and counselling services to support the overall well-being of
                students.
              </p>
            </li>
            <li>
              <p>
                We are committed to nurturing mental and physical wellbeing and
                strive for a healthy mind in a healthy body.
              </p>
            </li>
            <li>
              <p>
                Our services include professional counselling, health check-ups,
                and wellness programs designed to support students throughout
                their academic journey.
              </p>
            </li>
            <li>
              <p>
                The Wellness Centre operates with complete confidentiality and
                provides a safe, supportive environment for all students.
              </p>
            </li>
          </ul>
        </div>

        {/* === Charter Section === */}
        <div className="charter">
          <p
            className="location-header"
            style={{
              textAlign: "center",
              marginBottom: "15px",
              marginTop: "15px",
            }}
          >
            Wellness Charter
          </p>
          <p
            className="location-header"
            style={{
              textAlign: "center",
              marginBottom: "20px",
              borderBottom: "1px solid #f8fafc",
            }}
          >
            Ten key values that guide everything we do:
          </p>

          <div className="marqueee">
            <div className="marqueee-content">
              <ul className="no-bullets">
                <li>1. Student well-being is our highest priority.</li>
                <li>2. We provide confidential and professional support.</li>
                <li>
                  3. We promote holistic wellness — mental, physical, emotional.
                </li>
                <li>4. We create a safe and inclusive environment for all.</li>
                <li>
                  5. We respect privacy and maintain strict confidentiality.
                </li>
                <li>
                  6. We offer accessible healthcare and counselling services.
                </li>
                <li>7. We encourage preventive care and wellness education.</li>
                <li>
                  8. We support students through their challenges with empathy.
                </li>
                <li>
                  9. We collaborate with students to achieve their wellness
                  goals.
                </li>
                <li>
                  10. We believe healthy students create a thriving community.
                </li>
              </ul>
              {/* Duplicate list for seamless infinite scroll */}
              <ul className="no-bullets">
                <li>1. Student well-being is our highest priority.</li>
                <li>2. We provide confidential and professional support.</li>
                <li>
                  3. We promote holistic wellness — mental, physical, emotional.
                </li>
                <li>4. We create a safe and inclusive environment for all.</li>
                <li>
                  5. We respect privacy and maintain strict confidentiality.
                </li>
                <li>
                  6. We offer accessible healthcare and counselling services.
                </li>
                <li>7. We encourage preventive care and wellness education.</li>
                <li>
                  8. We support students through their challenges with empathy.
                </li>
                <li>
                  9. We collaborate with students to achieve their wellness
                  goals.
                </li>
                <li>
                  10. We believe healthy students create a thriving community.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Contact Section ===== */}
      <div className="contact-banner">
        <div className="div-main">
          <div className="contact-info">
            <div className="address">
              <div className="home-h">
                <p
                  style={{
                    marginBottom: "10px",
                    borderLeft: "4px solid #c00404",
                    paddingLeft: "10px",
                    fontWeight: "600",
                  }}
                >
                  Location
                </p>
              </div>

              <div className="address-content">
                <p className="fs" style={{ color: "#86198f" }}>
                  <FaLocationDot />
                </p>
                <div className="location-sw">
                  <p>Wellness Centre - IIT Dharwad</p>
                  <p>Belur Industrial Area, Chikkamalligawad,</p>
                  <p>Dharwad - 580 011,</p>
                  <p>Karnataka, India</p>
                </div>
              </div>

              <div className="div-contact">
                For more information, contact us:
              </div>

              <div className="email-contact">
                <p style={{ color: "#86198f" }}>
                  <AiOutlineMail />
                </p>
                <p>wellness@iitdh.ac.in</p>
              </div>
            </div>
          </div>

          <div className="image-div">
            <img src={wellnessImage1} alt="Wellness Centre" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default WellnessHome;
