import React from "react";

import "./Counselling.css";
import { motion } from "framer-motion";

import tta from "../../../images/talktoangel.png";
import te from "../../../images/tele-manas-mental-health-service1.jpg";
import karuneMainLogo from "../../../images/counselling-centre/karune-main-logo.png";
import DrugFlyer from "../../../images/Flyper-Drug-01.png";

import SavitaBasavarajAngadi from "../../../images/counselling-centre/savita-basavaraj-angadi.png";
import DarshanaKishoreGandhi from "../../../images/counselling-centre/darshana-kishore-gandhi.jpg";
import Navyashree from "../../../images/counselling-centre/navyashree.jpg";
import SymposiumImage1 from "../../../images/counselling-centre/wellness-symposium-1.jpg";
import SymposiumImage2 from "../../../images/counselling-centre/wellness-symposium-2.jpeg";
import SymposiumImage3 from "../../../images/counselling-centre/wellness-symposium-3.jpg";

import BootstrapCard from "../../../components/Cards/BootstrapCard.js";
import Marquee from "react-fast-marquee";

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
          style={{ maxHeight: "200px", width: "auto" }}
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
            color: "#86198f",
          }}
        >
          Wellness Symposium Part II
        </p>

        <div
          style={{
            maxWidth: "1000px",
            width: "90%",
            marginTop: "20px",
            marginBottom: "30px",
            textAlign: "left",
            borderTop: "3px solid #86198f",
            paddingTop: "25px",
          }}
        >
          <h3
            style={{
              color: "#1f2937",
              fontWeight: "600",
              marginBottom: "15px",
            }}
          >
            Faculty Engagement in Supporting Student Well Being
          </h3>

          <p className="fs-5">
            Students and PhD scholars face academic and personal challenges that
            can affect their mental and emotional well being. Faculty are often
            the first to notice when something is ongoing. This session will
            help us understand how we can support our students, create a safe
            and caring environment, and guide them to the right help when
            needed.
          </p>

          <div className="text-center my-4">
            <Marquee direction="left" speed={60} pauseOnHover={true}>
              {[SymposiumImage2, SymposiumImage1, SymposiumImage3].map((img, i) => (
                <div key={i} className="symposium_image_wrapper">
                  <img src={img} alt="Wellness Symposium" />
                </div>
              ))}
            </Marquee>
          </div>

          <div className="symposium-meta-box">
            <div>
              <span>Date</span>
              <strong>13 July 2026</strong>
            </div>
            <div>
              <span>Time</span>
              <strong>11:00am - 12:30pm</strong>
            </div>
            <div>
              <span>With</span>
              <strong>Wellness Centre - MHP's</strong>
            </div>
            <div>
              <span>Venue</span>
              <strong>CLT - III</strong>
            </div>
          </div>

          <div className="symposium-closing">Lets work together</div>
        </div>



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
              style={{ width: "30%", height: "auto" }}
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
              style={{ width: "30%", height: "auto" }}
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

      <div className="d-flex flex-column align-items-center mt-5 mb-4">
        <details className="past-events-panel">
          <summary>Past Events</summary>
          <div className="past-events-content">
            <h3>
              Webinar: From Curiosity to Dependence: Educating Students About
              Drug Risk
            </h3>

            <p className="fs-5">
              As part of our awareness initiatives, we hosted a webinar aimed at
              educating the student community on the ill-effects of drugs and
              helping overcome addiction.
            </p>

            <div className="text-center my-4">
              <img
                src={DrugFlyer}
                alt="Drug Awareness Webinar"
                className="img-fluid rounded"
                style={{
                  maxHeight: "700px",
                  width: "auto",
                }}
              />
            </div>

            <p className="fs-5">
              Drug addiction or abuse continues to be a growing concern,
              affecting individuals, families, and communities. This session
              conducted by <strong>Dr. R.K. Suri</strong> helped participants
              understand the causes, warning signs, impact of drug abuse,
              prevention strategies, and ways to seek help for themselves or
              others in need.
            </p>

            <p className="fs-5">
              Teenagers and students fall prey to substances and drugs,
              sometimes becoming highly dependent on them.
            </p>

            <div className="past-events-speaker-box">
              <p className="mb-2">
                <strong>Speaker:</strong> Dr. R.K. Suri
              </p>

              <p className="mb-0">
                RCI-registered Clinical Psychologist and Mentor & Director at
                TalkToAngel with 42+ years of experience in counselling
                individuals across all age groups.
              </p>
            </div>

            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mt-4">
              <div className="fs-5">
                <div>
                  <strong>Date:</strong> 26 June 2026
                </div>
                <div>
                  <strong>Time:</strong> 12:00 PM IST
                </div>
                <div>
                  <strong>Meeting ID:</strong> 753 083 4306
                </div>
                <div>
                  <strong>Passcode:</strong> Talk2Angel
                </div>
              </div>

              <a
                href="https://us02web.zoom.us/j/7530834306?pwd=T8A6KdtfqPXVWUmzH2KMJ8rcpQfTQF.1&omn=86843867392"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "linear-gradient(135deg, #86198f, #ae66b5)",
                  color: "white",
                  padding: "14px 28px",
                  borderRadius: "999px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "1.05rem",
                  boxShadow: "0 4px 14px rgba(134,25,143,0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                Join Zoom Webinar →
              </a>
            </div>
          </div>
        </details>
      </div>
    </motion.div>
  );
}

export default Counselling;
