import React from "react";
import "./UniversityCard.css"; // Import CSS file for styling if needed
import { useNavigate } from "react-router-dom";
import { truncate } from "lodash";

const UniversityCard = ({ card }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flexColStart r-card"
      onClick={() => navigate(`/university/${card.id}`)}
    >
      <img src={card.logo} alt={card.name} />
      <span className="primaryText">{card.name}</span>
    </div>
  );
};

export default UniversityCard;
