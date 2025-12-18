import React from "react";
import ImageGrid from "../../components/ImageGrid/ImageGrid.js";
import sc1 from "../../images/studentcampus1.jpg";
import sc2 from "../../images/homeimage5.jpg";
import sc4 from "../../images/studentcampus4.jpg";
import sc5 from "../../images/studentcampus5.png";
import sc7 from "../../images/studentcampus.jpg";
import sc8 from "../../images/studentcampuslife.jpg";
import sc9 from "../../images/homeimage11.jpg";
import sc10 from "../../images/homeimage4.jpg";
import sc11 from "../../images/homeimage9.jpg";
import sc12 from "../../images/homeimage7.jpg";
import { motion } from "framer-motion";

const images = [
  { src: sc1, alt: "Image 1" },
  { src: sc2, alt: "Image 2" },
  { src: sc4, alt: "Image 3" },
  { src: sc5, alt: "Image 4" },
  { src: sc7, alt: "Image 5" },
  { src: sc8, alt: "Image 6" },
  { src: sc9, alt: "Image 7" },
  { src: sc10, alt: "Image 8" },
  { src: sc11, alt: "Image 9" },
  { src: sc12, alt: "Image 10" },
];

// Split images into rows of 3
const numImgPerRow = 3;
const rows = [];

for (let i = 0; i < images.length; i += numImgPerRow) {
  rows.push(images.slice(i, i + numImgPerRow));
}

export default function StudentCampusLife() {
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

        <h1 className="mb-2">Life at IIT Dharwad</h1>

        <div className="d-flex flex-column">
          <hr className="w-50 border-3 align-self-center" />
        </div>

        <div className="mt-5">
          <div className="custom-sub-header fs-2">
            <p>Student Campus Life</p>
          </div>
          <div className="custom-content text-left fs-5">
            <p>
              IIT Dharwad is located at Chikkamalligawad. The new 470-acre
              campus features a green mini forest with its own flora and fauna,
              providing opportunities for jogging, cycling, and walking. Daytime
              is consumed by fast-paced academic activities in classes and
              laboratories, while evenings are devoted to sports and club
              activities. Facilities such as an indoor sports complex, a
              library, a night canteen, and a general store are available for
              the students' convenience. The campus environment is designed to
              foster a holistic educational experience, blending rigorous
              academic pursuits with opportunities for personal growth and
              recreation. The natural setting offers a tranquil backdrop for
              relaxation and reflection, encouraging students to maintain a
              healthy lifestyle amidst their busy schedules.
            </p>

            <div>
              <ImageGrid
                key={1}
                images={images.slice(0, 3)}
                width="332px" // Adjustable width
                height="250px" // Adjustable height
                columns={3} // Adjustable number of columns
              />
            </div>

            <p>
              During the day, students engage in dynamic academic activities
              characterized by interactive lectures and hands-on laboratory
              sessions. The curriculum challenges students intellectually while
              equipping them with practical skills necessary for their future
              careers. Faculty members, who are experts in their respective
              fields, mentor students, fostering a culture of inquiry and
              innovation. As the sun sets, the campus transforms into a hub of
              extracurricular activities. Evenings are dedicated to sports and
              various club activities, allowing students to unwind and explore
              their interests outside of academics.
            </p>

            <div>
              <ImageGrid
                key={1}
                images={images.slice(3, 6)}
                width="332px" // Adjustable width
                height="250px" // Adjustable height
                columns={3} // Adjustable number of columns
              />
            </div>

            <p>
              The indoor sports complex offers facilities for various sports,
              encouraging physical fitness and teamwork. Clubs and organizations
              provide opportunities for students to engage in cultural,
              technical, and social activities. Regular events, workshops, and
              cultural festivals create a vibrant campus culture, encouraging
              collaboration and camaraderie among students while enriching their
              educational journey. To support student life, the campus features
              a well-stocked library with extensive resources, a night canteen
              for socializing and dining, and a general store for everyday
              essentials. These facilities enhance the overall student
              experience, making campus life convenient and enjoyable.
            </p>

            <div>
              <ImageGrid
                key={1}
                images={images.slice(6, 10)}
                width="332px" // Adjustable width
                height="250px" // Adjustable height
                columns={3} // Adjustable number of columns
              />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
