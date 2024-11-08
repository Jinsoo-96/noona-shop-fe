import React from "react";
import "./../style/skeletoncard.style.css";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text"></div>
    </div>
  );
};

export default SkeletonCard;
