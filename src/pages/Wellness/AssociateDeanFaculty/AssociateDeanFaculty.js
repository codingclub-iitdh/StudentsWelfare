import React from "react";
import { motion } from "framer-motion";

import BootstrapCard from "../../../components/Cards/BootstrapCard.js";

import RajshekarK from "../../../images/faculty/rajshekar-k.jpg";
import OmkarBasavaraj from "../../../images/faculty/omkar-basavaraj-bembalge.jpg";
import RidhimaTewari from "../../../images/faculty/ridhima-tewari.jpg";

function AssociateDeanFaculty() {
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

      <h1 className="mb-2">Associate Dean & Faculty in Charge</h1>

      <div className="d-flex flex-column">
        <hr className="w-50 border-3 align-self-center" />
      </div>

      <div className="d-flex flex-column align-items-center">
        <div className="rounded custom-important-container">
          <div className="row p-5 justify-content-center">
            <div className="col-lg-4 col-md-12">
              <BootstrapCard
                image={RidhimaTewari}
                name="Prof. Ridhima Tewari"
                title="Dean Wellness"
                moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/ridhima-tewari'>Prof. Ridhima Tewari's Homepage</a>"
                email="mailto:dean.wellness@iitdh.ac.in"
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <BootstrapCard
                image={RajshekarK}
                name="Prof. Rajshekar K"
                title="Associate Dean, Wellness"
                moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/rajshekar-k'>Prof. Rajshekar K's Homepage</a>"
                email="mailto:adean.sww@iitdh.ac.in"
              />
            </div>
            <div className="col-lg-4 col-md-6">
              <BootstrapCard
                image={OmkarBasavaraj}
                name="Prof. Omkar Baswaraj Bembalge"
                title="Faculty-In-Charge, Wellness"
                moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/omkar-baswaraj-bembalge'>Prof. Omkar Baswaraj Bembalge's Homepage</a>"
                email="mailto:fic.counselling@iitdh.ac.in"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AssociateDeanFaculty;
