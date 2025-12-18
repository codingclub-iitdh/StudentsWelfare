import React from "react";
import { motion } from "framer-motion";

import mentorsData from "../Counselling/CounsellingMentorsData.js";

function StudentWellnessMentors() {
  return (
    <motion.div
      className="pb-5 pt-2 mx-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="d-flex flex-column">
        <hr className="w-50 border-3 align-self-center" />
      </div>

      <h1 className="mb-2">Student Wellness Mentors</h1>

      <div className="d-flex flex-column">
        <hr className="w-50 border-3 align-self-center" />
      </div>

      <div className="custom-content text-start fs-4">
        <p className="text-start fs-4">
          Our Student Wellness Mentors are dedicated individuals who provide
          support and guidance to their peers. They are trained to listen,
          empathize, and help students navigate their challenges. If you need
          someone to talk to or seek advice, feel free to reach out to any of
          our mentors listed below.
        </p>
      </div>

      <div
        className="custom-important-container"
        style={{ borderBottom: "5px solid #86198f" }}
      >
        <div className="row g-1">
          {mentorsData.map((mentor, index) => {
            const totalMentors = mentorsData.length;
            let colClassLg = "col-lg-4";
            let colClassMd = "col-md-6";

            if (totalMentors % 3 === 1) {
              if (index === totalMentors - 1) {
                colClassLg = "col-lg-12";
              }
            } else if (totalMentors % 3 === 2) {
              if (index === totalMentors - 1) {
                colClassLg = "col-lg-6";
              } else if (index === totalMentors - 2) {
                colClassLg = "col-lg-6";
              }
            }

            if (totalMentors % 2 === 1) {
              if (index === totalMentors - 1) {
                colClassMd = "col-md-12";
              }
            }

            return (
              <div className={`${colClassLg} ${colClassMd}`} key={index}>
                <div className="card text-center">
                  <div className="">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="card-img-top rounded-circle"
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{mentor.name}</h5>
                    <p className="card-text">{mentor.email}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default StudentWellnessMentors;
