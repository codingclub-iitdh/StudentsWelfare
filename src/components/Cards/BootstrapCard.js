import React, { useState } from "react";
import "./BootstrapCard.css";

const BootstrapCard = ({ image, name, title, email, moreInfoHTML }) => {
  const [showHoverCard, setShowHoverCard] = useState(false);

  const handleMouseEnter = () => {
    setShowHoverCard(true);
  };

  const handleMouseLeave = () => {
    setShowHoverCard(false);
  };

  const handleClick = () => {
    setShowHoverCard((prev) => !prev); // Toggle on click for mobile
  };

  if (email && email.startsWith("mailto:")) {
    email = email.substring(7);
  }

  return (
    <div
      className="card text-center"
      style={{ width: "250px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick} // Handle click for mobile
    >
      <div className="card-body d-flex flex-column" style={{ height: "100%" }}>
        {image && (
          <img
            src={image}
            alt={name || ""}
            className="rounded-circle card-img-top"
          />
        )}
        {name && <h5 className="card-name">{name}</h5>}
        {title && <p className="card-title">{title}</p>}
        {email && (
          <i style={{ fontSize: "14px", color: "black", marginTop: "auto" }}>
            <p className="card-email">
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          </i>
        )}
      </div>
      {moreInfoHTML && (
        <div
          className="hover-card"
          dangerouslySetInnerHTML={{ __html: moreInfoHTML }}
        />
      )}
    </div>
  );
};

export default BootstrapCard;
