import React from "react";
import { motion } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import Marquee from "react-fast-marquee";

// Images
import background1 from "../../images/administrativeblock.jpg";
import hostel1 from "../../images/homeimage2.jpg";
import hostel2 from "../../images/homeimage3.jpg";
import hostel3 from "../../images/homeimage4.jpg";
import hostel4 from "../../images/homeimage5.jpg";
import hostel5 from "../../images/homeimage6.jpg";
import hostel6 from "../../images/homeimage7.jpg";
import hostel7 from "../../images/homeimage8.jpg";
import hostel8 from "../../images/homeimage9.jpg";
import hostel9 from "../../images/homeimage1.jpg";
import hostel10 from "../../images/homeimage10.jpg";
import hostel11 from "../../images/homeimage11.jpg";
import hostel12 from "../../images/homeimage12.jpg";
import hostel13 from "../../images/homeimage13.png";
import hostel14 from "../../images/homeimage14.png";

import "./Home.css";

function StudentWelfareHome() {
  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* IMAGE MARQUEE */}
      <div className="App">
        <Marquee direction="left" speed={100} pauseOnHover={true}>
          {[
            hostel5,
            hostel1,
            hostel2,
            hostel3,
            hostel4,
            background1,
            hostel6,
            hostel8,
            hostel7,
            hostel10,
            hostel9,
            hostel11,
            hostel12,
            hostel13,
            hostel14,
          ].map((img, i) => (
            <div key={i} className="image_wrapper">
              <img src={img} alt="loading" />
            </div>
          ))}
        </Marquee>
      </div>

      {/* ABOUT + CHARTER SECTION */}
      <div className="wrapper-about">
        <div className="about-page">
          <ul>
            <p style={{ marginBottom: "50px", fontWeight: "600" }}>About Us</p>
            <li>
              <p>
                The office of the Dean Students Welfare at IIT Dharwad
                administers all aspects of Students Welfare including Hostels,
                Health and Wellness, Cocurricular activities, Sports, Social
                Service, Cultural events, Technical clubs, NSO and Social
                outreach activities of Students.
              </p>
            </li>
            <li>
              <p style={{ marginTop: "10px" }}>
                It is responsible for implementing students' code of conduct.
                The Students Welfare Team at IIT Dharwad believes in all round
                development of holistic personality of its students. IIT Dharwad
                practices gender equality, respects neurodivergence and is
                socially all inclusive residential campus.
              </p>
            </li>
            <li>
              <p style={{ marginTop: "20px" }}>
                The Students Welfare team administers Hostels, Mess, Canteens,
                Sports, NSO/NSS and other infrastructure facilities extensively
                used by Students as well as Campus residents.
              </p>
            </li>
            <li>
              <p style={{ marginTop: "15px" }}>
                It also manages the Wellness Centre which hosts Health and
                Counselling services.
              </p>
            </li>
            <li>
              <p style={{ marginTop: "20px" }}>
                The Hostels and other Students Activity facilities are spread
                over two campuses, one at WALMI Campus and the other at
                Permanent Campus.
              </p>
            </li>
          </ul>
        </div>

        {/* STUDENT WELFARE CHARTER */}
        <div className="charter">
          <p
            className="location-header"
            style={{
              textAlign: "center",
              marginBottom: "20px",
              marginTop: "15px",
            }}
          >
            Students Welfare Charter
          </p>
          <p
            className="location-header"
            style={{
              textAlign: "center",
              marginBottom: "23px",
              borderBottom: "1px solid #f8fafc",
            }}
          >
            Ten key values that are foundational to everything we do:
          </p>

          <div className="marqueee">
            <div className="marqueee-content">
              <ul className="no-bullets">
                <li>1. Students and their welfare is our first priority.</li>
                <li>
                  2. We strive for excellence and encourage overall development.
                </li>
                <li>3. We thrive on diversity and promote inclusion.</li>
                <li>4. We celebrate collaboration and community living.</li>
                <li>5. We value innovation, merit, and ethics.</li>
                <li>6. We respect privacy and self-expression.</li>
                <li>7. We nurture mental and physical wellbeing.</li>
                <li>8. We uphold courtesy and respect for all beings.</li>
                <li>9. We act responsibly toward society and nation.</li>
                <li>
                  10. We believe that happy students make a happy institution.
                </li>
              </ul>
              {/* duplicate for infinite scroll */}
              <ul className="no-bullets">
                <li>1. Students and their welfare is our first priority.</li>
                <li>
                  2. We strive for excellence and encourage overall development.
                </li>
                <li>3. We thrive on diversity and promote inclusion.</li>
                <li>4. We celebrate collaboration and community living.</li>
                <li>5. We value innovation, merit, and ethics.</li>
                <li>6. We respect privacy and self-expression.</li>
                <li>7. We nurture mental and physical wellbeing.</li>
                <li>8. We uphold courtesy and respect for all beings.</li>
                <li>9. We act responsibly toward society and nation.</li>
                <li>
                  10. We believe that happy students make a happy institution.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="contact-banner" style={{ fontSize: "1.2rem" }}>
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
                  <p>Students Welfare Office - IIT Dharwad</p>
                  <p>Administration Block, NE 015</p>
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
                <p>studentswelfare.office@iitdh.ac.in</p>
              </div>
            </div>
          </div>

          <div className="image-div">
            <img src={background1} alt="loading" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default StudentWelfareHome;
