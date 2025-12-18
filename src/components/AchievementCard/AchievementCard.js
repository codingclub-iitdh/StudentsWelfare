import React from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal } from "react-icons/fa";
import ImageCarousel from "./ImageCarousel.js";
import "./AchievementCard.css";

const AchievementCard = ({ achievement, variants }) => {
  // Map icon names to actual components
  const iconMap = {
    FaTrophy: FaTrophy,
    FaMedal: FaMedal,
  };

  const IconComponent = iconMap[achievement.icon] || FaTrophy;

  return (
    <motion.div
      className={`achievement-card ${achievement.color}`}
      variants={variants}
      whileHover="hover"
    >
      <div className="card-inner">
        {/* Image Carousel */}
        {achievement.images && achievement.images.length > 0 && (
          <div className="card-images">
            <ImageCarousel images={achievement.images} />
          </div>
        )}

        <div className="card-text-content">
          <div className="card-icon">
            <IconComponent />
          </div>

          <div className="card-content">
            <h3 className="achievement-event">{achievement.event}</h3>
            <p className="achievement-subtitle-text">{achievement.title}</p>

            <div className="achievement-meta">
              <span className="placement-badge">{achievement.placement}</span>
              <span className="year-badge">{achievement.year}</span>
            </div>

            <p className="achievement-description">{achievement.description}</p>
          </div>
        </div>
      </div>

      <div className="card-accent"></div>
    </motion.div>
  );
};

export default AchievementCard;
