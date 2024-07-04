import React from "react";

const DistanceFilter = ({ selectedDistance, setSelectedDistance }) => {
  const handleDistanceChange = (distance) => {
    setSelectedDistance((prevDistance) =>
      prevDistance === distance ? "all" : distance
    );
  };

  return (
    <div>
      <div className="py-3 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-3 text-[#1f3e72]">Distance</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="distance"
              value="0-1"
              checked={selectedDistance === "0-1"}
              onChange={() => handleDistanceChange("0-1")}
              className="form-checkbox"
            />
            0-1 km
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="distance"
              value="1.1-3"
              checked={selectedDistance === "1.1-3"}
              onChange={() => handleDistanceChange("1.1-3")}
              className="form-checkbox"
            />
            1-3 km
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="distance"
              value="3-5"
              checked={selectedDistance === "3-5"}
              onChange={() => handleDistanceChange("3-5")}
              className="form-checkbox"
            />
            3-5 km
          </label>
        </div>
      </div>
    </div>
  );
};

export default DistanceFilter;
