import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AchievementCard from "../../components/AchievementCard/AchievementCard.js";
import achievementsData from "./achievementsData.js";
import "./StudentAchievements.css";

const StudentAchievements = () => {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setColumns(1);
      else if (window.innerWidth <= 1100) setColumns(2);
      else setColumns(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Helper to estimate card height for distribution
  const getEstimatedHeight = (item) => {
    let height = 250; // Base height for padding, title, meta, etc.

    // Add height for description (approximate char count to pixels)
    if (item.description) {
      height += item.description.length * 0.6;
    }

    // Add height for images
    if (item.images && item.images.length > 0) {
      height += 350; // Approximate height of image carousel
    }

    return height;
  };

  // Distribute items into columns to minimize height differences (Greedy approach)
  const columnData = Array.from({ length: columns }, () => []);
  const columnHeights = Array(columns).fill(0);

  achievementsData.forEach((item) => {
    // Find the column with the minimum current height
    const minHeightIndex = columnHeights.indexOf(Math.min(...columnHeights));

    // Add item to that column
    columnData[minHeightIndex].push(item);

    // Update that column's height
    columnHeights[minHeightIndex] += getEstimatedHeight(item);
  });

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
        {columnData.map((colItems, colIndex) => (
          <div key={colIndex} className="achievements-column">
            {colItems.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                variants={cardVariants}
              />
            ))}
          </div>
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
