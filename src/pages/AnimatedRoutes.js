import React from "react";
import { useLocation, Routes, Route, Router } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar.js";
import Home from "./Home/Home.js";
import WellnessHome from "./Home/WellnessHome.js";
import StudentWelfareHome from "./Home/StudentWelfareHome.js";
import AdministrativeOffice from "./AdministrativeOffice/AdministrativeOffice.js";
import Hostels from "./Hostels/Hostels.js";
import MessAndCanteen from "./MessAndCanteen/MessAndCanteen.js";
import Gymkhana from "./Gymkhana/Gymkhana.js";
import GoToTop from "./GoToTop.js";
import StudentCampusLife from "./StudentCampusLife/StudentCampusLife.js";
import Health from "./Wellness/Health/Health.js";
import Counselling from "./Wellness/Counselling/Counselling.js";
import StudentWellnessMentors from "./Wellness/StudentWellnessMentors/StudentWellnessMentors.js";
import AssociateDeanFaculty from "./Wellness/AssociateDeanFaculty/AssociateDeanFaculty.js";
import DeansAssociateDeans from "./DeansAssociateDeans/DeansAssociateDeans.js";
import { gsap } from "gsap";
import { Power3 } from "gsap";

import Others from "./Others.js";
import { AnimatePresence } from "framer-motion";
import StudentAchievements from "./StudentAchievements/StudentAchievements.js";

// import StudentActivities from '../components/StudentActivities.js';
// import Rti from '../components/Rti.js';
/* <Route path="/student-activities" element={<StudentActivities />} /> */
/* <Route path="/rti" element={<Rti/>}/> */

export default function AnimatedRoutes() {
  const location = useLocation();

  let t1 = new gsap.timeline();
  let ease = Power3.easeOut();
  return (
    <div>
      <GoToTop />

      <Sidebar>
        {/* <AnimatePresence> */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/wellness-home" element={<WellnessHome />} />
          <Route
            path="/student-welfare-home"
            element={<StudentWelfareHome />}
          />

          <Route
            path="/dean_associate_deans"
            element={<DeansAssociateDeans />}
          />
          <Route
            path="/administrative_office"
            element={<AdministrativeOffice />}
          />
          <Route path="/hostels" element={<Hostels />} />
          <Route path="/mess_canteen" element={<MessAndCanteen />} />
          <Route path="/gymkhana" element={<Gymkhana />} />
          <Route path="/student_life" element={<StudentCampusLife />} />
          <Route
            path="/student_achievements"
            element={<StudentAchievements />}
          />
          <Route
            path="/health"
            timeline={t1}
            ease={ease}
            element={<Health />}
          />

          <Route
            path="/student-wellness-mentors"
            element={<StudentWellnessMentors />}
          />
          <Route
            path="/dean_associate_deans_wellness"
            element={<AssociateDeanFaculty />}
          />

          <Route path="/others" element={<Others />} />
          <Route path="/counselling" element={<Counselling />} />
        </Routes>
        {/* </AnimatePresence> */}
      </Sidebar>
    </div>
  );
}
