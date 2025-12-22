import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaImage } from "react-icons/fa";
import "./ImageCarousel.css";

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState({});
  const [imageError, setImageError] = useState({});

  if (!images || images.length === 0) {
    return (
      <div className="no-images">
        <p>No images available</p>
      </div>
    );
  }

  const handleImageLoad = (index) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index) => {
    setImageError((prev) => ({ ...prev, [index]: true }));
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="image-carousel-wrapper">
      {/* Main Carousel */}
      <div className="carousel-main">
        <AnimatePresence mode="wait">
          {imageError[currentIndex] ? (
            <div className="image-error-placeholder" key={`error-${currentIndex}`}>
              <FaImage className="error-icon" />
              <p>Image unavailable</p>
            </div>
          ) : (
            <>
              {!imageLoaded[currentIndex] && (
                <div className="image-loading-placeholder">
                  <div className="loading-spinner"></div>
                </div>
              )}
              <motion.img
                key={currentIndex}
                src={currentImage.src}
                alt={currentImage.alt || "Achievement image"}
                className={`carousel-image ${imageLoaded[currentIndex] ? 'loaded' : 'loading'}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: imageLoaded[currentIndex] ? 1 : 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onLoad={() => handleImageLoad(currentIndex)}
                onError={() => handleImageError(currentIndex)}
              />
            </>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="carousel-nav carousel-nav-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            <button
              className="carousel-nav carousel-nav-next"
              onClick={goToNext}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="carousel-counter">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Dot Indicators - inside carousel */}
        {images.length > 1 && (
          <div className="carousel-dots">
            {images.map((_, index) => (
              <motion.button
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
