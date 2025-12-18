import React from "react";
import { motion } from "framer-motion";
import AchievementCard from "../../components/AchievementCard/AchievementCard.js";
import achievementsData from "./achievementsData.js";
import "./StudentAchievements.css";

const StudentAchievements = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(134, 25, 143, 0.2)",
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="achievements-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header Section */}
      <div className="achievements-header">
        <div className="d-flex flex-column">
          <hr className="w-50 border-3 align-self-center" />
        </div>
        <h1 className="achievements-title">Student Achievements</h1>
        <p className="achievements-subtitle">
          Celebrating the excellence and accomplishments of our students
        </p>
        <div className="d-flex flex-column">
          <hr className="w-50 border-3 align-self-center" />
        </div>
      </div>

      {/* Inspiration Message */}
      <div className="inspiration-message">
        <p>
          Our students have consistently demonstrated exceptional talent and
          dedication across various competitions and events. These achievements
          are a testament to their hard work, innovation, and commitment to
          excellence. We celebrate their success and use it as inspiration for
          future generations.
        </p>
      </div>

      {/* Achievements Grid */}
      <motion.div
        className="achievements-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {achievementsData.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            variants={cardVariants}
          />
        ))}
      </motion.div>

      {/* Call to Action */}
      <div className="achievements-cta">
        <p>
          Do you have achievements to celebrate? Contact the Students Welfare
          Office to share your accomplishments!
        </p>
      </div>
    </motion.div>
  );
};

export default StudentAchievements;
