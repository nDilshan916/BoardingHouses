import React, { useState } from "react";

const UniFilter = ({ uni, setUni }) => {
  const [showAll, setShowAll] = useState(false);

  const universities = [
    "Wayamba University of Sri Lanka",
    "University of Peradeniya",
    "University of Kelaniya",
    "Rajarata University of Sri Lanka",
    "Sabaragamuwa University of Sri Lanka",
    "University of Colombo",
  ];

  const handleUniChange = (selectedUni) => {
    setUni((prevUni) => (prevUni === selectedUni ? "all" : selectedUni));
  };

  const renderUniversities = () => {
    const displayedUnis = showAll ? universities : universities.slice(0, 4);
    return displayedUnis.map((university) => (
      <label
        key={university}
        className="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          name="uni"
          value={university}
          checked={uni === university}
          onChange={() => handleUniChange(university)}
          className="form-checkbox"
        />
        {university}
      </label>
    ));
  };

  return (
    <div>
      <div className="py-3 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-3 text-[#1f3e72]">University</h2>
        <div className="flex flex-col gap-3">
          {renderUniversities()}
          {universities.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:no-underline justify-center mt-2 border-none"
            >
              {showAll ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniFilter;
