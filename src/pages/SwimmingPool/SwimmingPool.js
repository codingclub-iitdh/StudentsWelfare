import React from "react";
import { motion } from "framer-motion";
import BackToTop from "../BackToTop";
import ImageGrid from "../../components/ImageGrid/ImageGrid.js";

import img1 from "../../images/SwimmingPool/IMG20260201173224.jpg.jpeg";
import img2 from "../../images/SwimmingPool/IMG20260201173330.jpg.jpeg";
import img3 from "../../images/SwimmingPool/IMG20260201173458.jpg.jpeg";
import img4 from "../../images/SwimmingPool/IMG20260201173708.jpg.jpeg";
import img5 from "../../images/SwimmingPool/IMG20260201174029.jpg.jpeg";
import img6 from "../../images/SwimmingPool/IMG20260201174350.jpg.jpeg";

export default function SwimmingPool() {
  const weekdaySlots = [
    { time: "6:30 AM – 7:15 AM", category: "Boys" },
    { time: "7:20 AM – 8:05 AM", category: "Boys" },
    { time: "8:10 AM – 8:55 AM", category: "Girls" },
    { time: "4:00 PM – 4:45 PM", category: "Girls" },
    {
      time: "4:50 PM – 5:35 PM",
      category: "Boys (every Wednesday for Faculty and staff families)",
    },
    { time: "5:40 PM – 6:25 PM", category: "Boys" },
  ];

  const weekendSlots = [
    { time: "7:00 AM – 7:45 AM", category: "Boys" },
    { time: "7:50 AM – 8:35 AM", category: "Boys" },
    { time: "8:40 AM – 9:25 AM", category: "Girls" },
    { time: "9:30 AM – 10:30 AM", category: "Faculty and staff families" },
    { time: "3:00 PM – 3:45 PM", category: "Girls" },
    { time: "3:50 PM – 4:35 PM", category: "Boys" },
    { time: "4:40 PM – 5:25 PM", category: "Boys" },
    { time: "5:30 PM – 6:15 PM", category: "Boys" },
  ];

  const documents = [
    {
      name: "Registration Form for Aquatics",
      file: "/documents/Registration-form-for-Aquatics.pdf",
    },
    {
      name: "Medical Fitness Certificate for Aquatic Sports (Swimming)",
      file: "/documents/Medical-Fitness-Certificate-for-Aquatic-Sports.pdf",
    },
    {
      name: "Aquatic Sports – Rules and Regulations",
      file: "/documents/Aquatic-Sports-Rules-And-Regulations.pdf",
    },
  ];

  const poolImages = [
    { src: img1, alt: "Swimming Pool 1" },
    { src: img2, alt: "Swimming Pool 2" },
    { src: img3, alt: "Swimming Pool 3" },
    { src: img4, alt: "Swimming Pool 4" },
    { src: img5, alt: "Swimming Pool 5" },
    { src: img6, alt: "Swimming Pool 6" },
  ];

  return (
    <>
      <motion.div
        className="pb-5 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="d-flex flex-column">
          <hr className="w-50 border-3 align-self-center" />
        </div>

        <h1 className="mb-2">Swimming Pool</h1>

        <div className="d-flex flex-column">
          <hr className="w-50 border-3 align-self-center" />
        </div>

        <div className="fs-2 mt-5">
          <p className="custom-sub-header">Aquatic Sports Facility</p>
        </div>

        <div className="custom-content text-start fs-5">
          <p>
            IIT Dharwad provides a state-of-the-art aquatic sports facility for
            students, faculty, and staff. The swimming pool is equipped with
            trained lifeguards and trainers during all operational slots.
          </p>

          <div>
            <ImageGrid
              key={1}
              images={poolImages}
              width="332px"
              height="250px"
            />
          </div>
        </div>

        <div className="fs-2 mt-5">
          <p className="custom-sub-header">Important Instructions</p>
        </div>

        <div className="custom-content text-start fs-5">
          <ol>
            <li className="mb-3">
              Submit your registration form, medical certificate, and payment
              copies at the Aquatic Sports facility.
            </li>
            <li className="mb-3">
              Lifeguards and trainers are available during all slots.
            </li>
            <li className="mb-3">
              Please maintain the slot timings, especially before the girls'
              slot starts. Kindly vacate the pool.
            </li>
          </ol>
        </div>

        <div className="fs-2 mt-5">
          <p className="custom-sub-header">Slot Distribution</p>
        </div>

        <div className="custom-content text-start fs-5">
          <div className="row">
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="rounded custom-important-container p-4">
                <h4
                  className="text-center mb-4"
                  style={{ color: "#86198f", fontWeight: 600 }}
                >
                  Tuesday to Friday
                </h4>

                <h5 className="mt-3 mb-2" style={{ color: "#666" }}>
                  Morning
                </h5>
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Time</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekdaySlots.slice(0, 3).map((slot, index) => (
                      <tr key={index}>
                        <td>{slot.time}</td>
                        <td>{slot.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h5 className="mt-4 mb-2" style={{ color: "#666" }}>
                  Evening
                </h5>
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Time</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekdaySlots.slice(3).map((slot, index) => (
                      <tr key={index}>
                        <td>{slot.time}</td>
                        <td>{slot.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-6 col-md-12 mb-4">
              <div className="rounded custom-important-container p-4">
                <h4
                  className="text-center mb-4"
                  style={{ color: "#86198f", fontWeight: 600 }}
                >
                  Saturday, Sunday & Public Holidays
                </h4>

                <h5 className="mt-3 mb-2" style={{ color: "#666" }}>
                  Morning
                </h5>
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Time</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekendSlots.slice(0, 4).map((slot, index) => (
                      <tr key={index}>
                        <td>{slot.time}</td>
                        <td>{slot.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h5 className="mt-4 mb-2" style={{ color: "#666" }}>
                  Evening
                </h5>
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Time</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekendSlots.slice(4).map((slot, index) => (
                      <tr key={index}>
                        <td>{slot.time}</td>
                        <td>{slot.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="fs-2 mt-5">
          <p className="custom-sub-header">Required Documents</p>
        </div>

        <div className="custom-content text-start fs-5">
          <p>
            Please download, fill out, and submit the following documents to
            access the swimming facility:
          </p>
          <ul>
            {documents.map((doc, index) => (
              <li key={index} className="mb-3">
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0284c7" }}
                >
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <BackToTop />
      </motion.div>
    </>
  );
}
