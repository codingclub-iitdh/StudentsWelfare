import React from "react";
import { motion } from "framer-motion";

const ImageGrid = ({
  images,
  width = "100%",
  height = "250px",
  columns = 3,
}) => {
  // Ensure columns is at least 1
  const cols = Math.max(1, columns);

  // chunk images into rows of `cols`
  const rows = [];
  for (let i = 0; i < images.length; i += cols) {
    rows.push(images.slice(i, i + cols));
  }

  return (
    <div style={{ width: "100%" }}>
      {rows.map((row, rIndex) => {
        // Always center rows for visual uniformity (single, two or full rows)
        const justify = "center";
        return (
          <div
            key={rIndex}
            style={{
              display: "flex",
              justifyContent: justify,
              gap: "1rem",
              marginBottom: "0.75rem",
            }}
          >
            {row.map((image, cIndex) => {
              const index = rIndex * cols + cIndex;
              const itemStyle = {
                flex: `0 0 ${100 / cols}%`,
                boxSizing: "border-box",
              };
              return (
                <div key={index} style={itemStyle}>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.45, delay: 0.12 * index }}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: height,
                        overflow: "hidden",
                        borderRadius: 8,
                      }}
                    >
                      <motion.img
                        src={image.src}
                        alt={image.alt}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.35 }}
                      />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ImageGrid;
