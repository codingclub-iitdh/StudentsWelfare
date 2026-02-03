import React from "react";
import Scrollevent from "../../Scrollerevent";

import "./Counselling.css";
import { motion } from "framer-motion";

import tta from "../../../images/talktoangel.png";
import te from "../../../images/tele-manas-mental-health-service1.jpg";
import karuneMainLogo from "../../../images/counselling-centre/karune-main-logo.png";

import mentorsData from "./CounsellingMentorsData.js";

import RajshekarK from "../../../images/faculty/rajshekar-k.jpg";
import SavitaBasavarajAngadi from "../../../images/counselling-centre/savita-basavaraj-angadi.png";
import PradeepYammiyavar from "../../../images/faculty/pradeep-yammiyavar.jpg";
import RidhimaTewari from "../../../images/faculty/ridhima-tewari.jpg";
import VijayalakshmiPeri from "../../../images/counselling-centre/vijayalakshmi-peri.jpg";
import DarshanaKishoreGandhi from "../../../images/counselling-centre/darshana-kishore-gandhi.jpg";
import Navyashree from "../../../images/counselling-centre/navyashree.jpg";

import BootstrapCard from "../../../components/Cards/BootstrapCard.js";

function Counselling() {
  return (
    <motion.div
      className="pb-5 pt-2 mx-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/*<div className="scroll">

                <Scrollevent />
            </div>*/}

      <div className="d-flex flex-column">
        <hr className="w-50 border-3 align-self-center" />
      </div>

      <h1 className="mb-2">Counselling Centre</h1>

      <div className="d-flex flex-column">
        <hr className="w-50 border-3 align-self-center" />
      </div>

      <div className="d-flex flex-column">
        <img
          src={karuneMainLogo}
          className="align-self-center bg-transparent"
          alt="Karune"
        />
      </div>

      <div className="custom-content text-start mt-5 fs-4">
        <p>
          The Counselling Center at IIT DHARWAD provides assistance and
          counselling service to all members of the institute.
          <br />
          Our dedicated team of professionals is committed to supporting the
          mental health and well-being of students, faculty, and staff. We offer
          a safe and confidential environment where individuals can discuss
          their concerns and receive guidance tailored to their needs.
          <br />
          There are two options available to anyone who wishes to seek
          counselling services:
        </p>
      </div>

      <div className="d-flex flex-column align-items-center mt-5 mb-4">
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#4338ca",
          }}
        >
          Mental Health is as important as Physical Health
        </p>
        <a
          href="https://drive.google.com/file/d/1J7glzRl_Z1cnnlN_VD3iblRfbGgQAd_S/view?usp=drivesdk"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "1.3rem",
            fontStyle: "italic",
            color: "#4338ca",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          Orientation presentation by TalkToAngel
        </a>
        <div
          style={{
            marginTop: "15px",
            marginBottom: "30px",
            aspectRatio: "16/9",
            maxWidth: "1000px",
            width: "90%",
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src="https://drive.google.com/file/d/1J7glzRl_Z1cnnlN_VD3iblRfbGgQAd_S/preview"
            title="TalkToAngel Orientation Presentation"
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
            style={{ border: "none", borderRadius: "4px" }}
          ></iframe>
        </div>
      </div>

      <div className="mt-5 custom-sub-header border-danger fs-3">
        <p>1. Online Counselling</p>
      </div>

      <div className="row g-3 d-flex align-items-stretch">
        {/* TalkToAngel Card */}
        <div className="col-lg-6">
          <div className="card w-100 h-100 p-3">
            <img
              src={tta}
              alt="TalkToAngel"
              className="card-img-top"
              style={{ width: "50%", height: "auto" }}
            />
            <div className="card-body">
              <h5 className="card-title fs-4">
                <a
                  href="/documents/IITDh-online-counselling-talk-to-angel-instructions.pdf"
                  className="text-decoration-none"
                >
                  Talk To Angel
                </a>
              </h5>
              <br />
              <p className="card-text fs-5">
                IIT Dharwad in cooperation with TalkToAngel -- a professional
                online counselling service, provides a direct link to anyone at
                IIT Dharwad to contact them and seek their services without any
                charge.
              </p>
              <a
                href="/documents/IITDh-online-counselling-talk-to-angel-instructions.pdf"
                className="btn btn-primary"
              >
                Connect With TalkToAngel
              </a>
            </div>
          </div>
        </div>

        {/* TeleMANAS Card */}
        <div className="col-lg-6">
          <div className="card w-100 h-100 p-3">
            <img
              src={te}
              alt="TeleMANAS"
              className="card-img-top"
              style={{ width: "50%", height: "auto" }}
            />
            <div className="card-body">
              <h5 className="card-title fs-4">
                <a
                  href="https://telemanas.mohfw.gov.in/home"
                  className="text-decoration-none"
                >
                  TeleMANAS
                </a>
              </h5>
              <br />
              <p className="card-text fs-5">
                TeleMANAS works with a network of Hubli-Dharwad based mental
                health hospitals and institutions to provide counselling both
                in-person and over the telephone. Anyone can avail this service
                directly.
              </p>
              <a
                href="https://telemanas.mohfw.gov.in/home"
                className="btn btn-primary"
              >
                Connect With TeleMANAS
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 custom-sub-header border-danger fs-3">
        <p>2. Face to Face Counselling</p>
      </div>

      <div className="custom-content text-start fs-4">
        <p>
          You may choose any counsellor that you prefer. Book your appointment
          online by clicking on the profile/card of the preferred counsellor
          below. Upon being granted an appointment, you may directly approach
          the counsellor without having to sign any registers at the Health
          Center.
        </p>
      </div>

      {/*<div className='d-flex flex-column align-items-center'>
                <div className='custom-important-container p-3' style={{ borderBottom: "5px solid #86198f" }}>
                    <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="g-s fs-3">
                                <p className="font-weight-bold" style={{ color: "#4338ca" }}>
                                    Prof. Pradeep Yammiyavar
                                </p>
                                <h4 className='fs-5'>Pg.D.MH PhD</h4>
                            </div>
                            <div className="appt">
                                <a
                                    href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2kkN9_v0ypAzAi8gCHQc1JFwFz7JdGrz4Ytog55w2QRrGwzcmVdvaLiSLc2avZY0dsK6u6NEF8"
                                    className="btn btn-link"
                                >
                                    BOOK APPOINTMENT
                                </a>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="g-s fs-3">
                                <p className="font-weight-bold" style={{ color: "#4338ca" }}>
                                    Ms. Vijayalakshmi Peri
                                </p>
                                <h4 className='fs-5'>M.A. Counseling Psychology</h4>
                            </div>
                            <div className="appt">
                                <a
                                    href="https://yourdost.com/auth/sign-in?serviceId=1&next=https:%2F%2Fyourdost.com%2Fin-person-counselling%2Ff2f%2Fiitdh"
                                    className="btn btn-link"
                                >
                                    BOOK APPOINTMENT
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>*/}

      <div className="rounded custom-important-container">
        <div className="row justify-content-center">
          {/* Prof. Pradeep Yammiyavar - Hidden (not available this semester)
          <div className="col-lg-3 col-md-6">
            <BootstrapCard
              image={PradeepYammiyavar}
              name="Prof. Pradeep Yammiyavar"
              title="Pg.D.MH PhD, Counselling Psychologist"
              moreInfoHTML={`
                                <b> More Info </b> <br>
                                <a href='https://calendar.app.google/cvPDEDBCr3XAFdXx5'>Book an appointment</a> <br>
                                Counselling Psychologist (Self discovery, Personality profiling, and Guidance)
                            `}
              email="mailto:counselor1.karuna@iitdh.ac.in"
            />
          </div>
          */}
          <div className="col-lg-3 col-md-6">
            <BootstrapCard
              image={SavitaBasavarajAngadi}
              name="Savita Basavaraj Angadi"
              title="Masters in Psychology, Counselling Psychologist"
              moreInfoHTML={`
                                <b> More Info </b> <br>
                                <a href='https://www.talktoangel.com/iit-dharwad/login'>Book an appointment</a> <br>
                                <a href='/documents/savita-basavaraj-angadi-profile.pdf'>Profile</a>
                            `}
              email="mailto:counselor2.karuna@iitdh.ac.in"
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <BootstrapCard
              image={DarshanaKishoreGandhi}
              name="Darshana Kishore Gandhi"
              title="M.Sc., M.Phil (Clin. Psych.), RCI Reg. Clinical Psychologist"
              moreInfoHTML={`
                                <b> More Info </b> <br>
                                <a href='https://calendar.app.google/zDd6wq2iUpymgHEs5'>Book an appointment</a> <br>
                                <a href='/documents/a-note-from-darshana.pdf'>A Note from the Counsellor</a> <br>
                                (CRR No.: A110099)
                            `}
              email="mailto:counselor3.karuna@iitdh.ac.in"
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <BootstrapCard
              image={Navyashree}
              name="Navyashree"
              title="M.Sc in Clinical and Counselling Psychology, Counselling Psychologist"
              moreInfoHTML={`
                                <b> More Info </b> <br>
                                <a href='https://calendar.app.google/aWnmKkN7aaXXD21w8'>Book an appointment</a> <br>
                                Counselling Psychologist (Individual Counselling and therapy, Group Counselling, Family Counselling, Life Skills training)
                            `}
              email="mailto:counselor4.karuna@iitdh.ac.in"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Counselling;
